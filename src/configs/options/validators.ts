import { IOptions } from './types';
import { VALID_REPO_OPTIONS } from './parsers';

export const validateOptionsState = (state: IOptions) => {
  onlyOneModeIsSelected(state);
  validPushBranchAndCommit(state);
  noUnnecessaryBranchOrCommitOptions(state);
};

export const onlyOneModeIsSelected = (state: IOptions) => {
  let modeSelected = false;
  Object.keys(state.modeState).forEach(mode => {
    const selected = state.modeState[mode];
    if (selected && modeSelected) {
      throw new Error('Mode than one mode is selected');
    } else if (selected) {
      modeSelected = true;
    }
  });
};

export const validPushBranchAndCommit = (state: IOptions) => {
  const { modeState, commitMessage, newBranch } = state;
  if (!modeState.push) {
    return;
  }

  if (!commitMessage) {
    throw new Error('A commit message must be supplied');
  }

  if (!newBranch) {
    throw new Error('A new branch must be supplied');
  }
};

export const noUnnecessaryBranchOrCommitOptions = (state: IOptions) => {
  const { repoFrom, repoTo, hashRepo } = state;
  const reposFromTo = [repoFrom, repoTo, hashRepo];
  const badOptions = VALID_REPO_OPTIONS.filter(opt => reposFromTo.indexOf(opt) === -1);

  const badCommitConfig = badOptions.map(opt => opt + 'Commit');

  const badBranchConfig = badOptions.map(opt => opt + 'Branch');

  const badConfig = [...badCommitConfig, ...badBranchConfig];

  badConfig.forEach(config => {
    if (!!state[config]) {
      throw new Error(`Cannot have ${config} set`);
    }
  });
};
