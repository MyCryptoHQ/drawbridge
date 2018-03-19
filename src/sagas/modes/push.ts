import { call } from 'redux-saga/effects';
const { yellow } = require('chalk');
import { getOptions } from '../../configs';
import { logger, gitNewBranch, gitCommit, gitPushOrigin, gitAddDistFolder } from '../../lib';

import { packageMode } from './package';
import { SagaIterator } from 'redux-saga';


export function* pushMode(): SagaIterator {
  yield call(packageMode);

  const options = yield call(getOptions);
  const { commitMessage, newBranch, environments, toEnvironment } = options;
  const toDistFolder = environments[toEnvironment].distFolder;
  const toWorkingFolder = environments[toEnvironment].workingFolder;  

  yield call(gitNewBranch, toWorkingFolder, newBranch);
  logger.succeed(`Checked out new branch ${yellow(newBranch)} on repo ${yellow(toEnvironment)}`);

  yield call(gitAddDistFolder, toWorkingFolder, toDistFolder);
  logger.succeed(`Staged ${yellow(toDistFolder)} for commit on repo ${toEnvironment}`);

  yield call(gitCommit, toWorkingFolder, commitMessage);
  logger.succeed(`Committed changes to branch ${yellow(newBranch)} on repo ${yellow(toEnvironment)}`);

  logger.log(
    `Pushing repo ${yellow(toEnvironment)} to ${yellow('origin')}, watch for SSH password prompt`
  );
  yield call(gitPushOrigin, toWorkingFolder, newBranch);
  logger.succeed(`Pushed repo ${yellow(toEnvironment)} to ${yellow('origin')}`);
}

