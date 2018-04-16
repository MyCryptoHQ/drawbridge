import { call } from 'redux-saga/effects';
import * as fse from 'fs-extra';
const { yellow } = require('chalk');

import { cloneAndBuildProject } from '../helpers';
import { getOptions, getEnvConfig } from '../../configs';
import { logger, gitRemoveFolder } from '../../lib';


export function* packageMode() {
  const options = yield call(getOptions);
  const {
    environments,
    fromEnvironment,
    fromBranch,
    fromCommit,
    toEnvironment,
    toBranch,
    toCommit
  } = options;


  // clone and build fromBranch
  yield call(cloneAndBuildProject, fromEnvironment, fromBranch, fromCommit);

  // clone and build toBranch
  yield call(cloneAndBuildProject, toEnvironment, toBranch, toCommit);

  // const repoInfo = yield call(getRepoInfo);
  const fromDistFolder = environments[fromEnvironment].distFolder;
  const toDistFolder = environments[toEnvironment].distFolder;
  const toWorkingFolder = environments[toEnvironment].workingFolder;

  logger.log(`Emptying environment ${yellow(toEnvironment)} dist folder`);
  yield call(gitRemoveFolder, toWorkingFolder, toDistFolder);
  logger.succeed(`Emptied environment ${yellow(toEnvironment)} dist folder`);

  logger.log(`Copying ${yellow(fromEnvironment)} to ${yellow(toEnvironment)}`);
  yield call(fse.copy, fromDistFolder, toDistFolder);
  logger.succeed(
    `Copied ${yellow(fromEnvironment)} [${yellow(fromDistFolder)}] to ${yellow(toEnvironment)} [${yellow(
      toDistFolder
    )}]`
  );
  logger.succeed(
    `Repo ${yellow(toEnvironment)} is now populated with dist files from repo ${yellow(
      fromEnvironment
    )}. These changes can be manually committed to a branch and pushed into a PR`
  );
}

