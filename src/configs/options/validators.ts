import * as path from 'path';

import { IRcOptions, TOptions, IModeOptions, IEnvironmentConfigs } from './types';
import { RC_PROPERTIES_WHITELIST } from '../constants';


/**
 * mode parsing validation
 */

export const validateModeOptions = (state: IModeOptions) => {
  onlyOneModeIsSelected(state);
};

const onlyOneModeIsSelected = (state: IModeOptions) => {
  let modeSelected = false;
  Object.keys(state.modeState).forEach(mode => {
    const selected = state.modeState[mode];
    if (selected && modeSelected) {
      throw new Error('More than one mode is selected');
    } else if (selected) {
      modeSelected = true;
    }
  });
};

/**
 * rc validation 
 */

export const validateRcOptions = (rcOpts: IRcOptions) => {
  noUnknownRcArgs(rcOpts);
  noEmptyConfig(rcOpts);
};

const noUnknownRcArgs = (rcOpts: IRcOptions) => {
  Object.keys(rcOpts).forEach(key => {
    if (RC_PROPERTIES_WHITELIST.indexOf(key) === -1) {
      throw new Error(`Unknown argument '${key}'`);
    } 
  });
};

const noEmptyConfig = (rcOpts: IRcOptions) => {
  if (rcOpts.config.length === 0) {
    throw new Error('No config file found');
  }
};

/**
 * merged app options validation
 */

export function validateAppOptions(options: TOptions) {
  const {
    fromEnvironment,
    toEnvironment,
    environments,
    config
  } = options;

  if (fromEnvironment) {
    ensureEnvironmentIsValid(fromEnvironment, environments, config);
  }

  if (toEnvironment) {
    ensureEnvironmentIsValid(toEnvironment, environments, config);
  }

  validPushBranchAndCommit(options);
}


function ensureEnvironmentIsValid(env: string, environments: IEnvironmentConfigs, config: string) {
  if (Object.keys(environments).indexOf(env) === -1) {
    throw new Error(`Environment '${env}' was not found in ${config}`);
  }

  const { gitUrl } = environments[env];

  if (!gitUrl || !gitUrl.length) {
    throw new Error(`Environment '${env}' needs to have property 'gitUrl' set`);
  }
}

function validPushBranchAndCommit (state: TOptions) {
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
}
