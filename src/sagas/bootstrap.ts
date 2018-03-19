import * as fse from 'fs-extra';
import { call } from 'redux-saga/effects';
import {
  logger,
  printWelcomeMessage,
  startLogWriteInterval,
  clearLogWriteInterval,
  criticalFailure,
  checkIfCliProgramIsInstalled
} from '../lib';

import { getOptions, REQUIRED_CLI_APPS, SESSION_FOLDER } from '../configs';

const { ensureDirSync } = fse;

export function* bootstrap() {
  try {
    yield call(ensureDirSync, SESSION_FOLDER);
    yield call(printWelcomeMessage);
    yield call(ensureCliAppsAreInstalled);
    yield call(ensureTempFolders);
    yield call(startLogWriteInterval);
  } catch (err) {
    criticalFailure(err);
  }
  logger.succeed('Bootstrapped');
}

export function* teardown() {
  yield call(clearLogWriteInterval);
}

export function* ensureTempFolders() {
  const { 
    mode, 
    fromEnvironment, 
    toEnvironment,
    fromEnvConfig,
    toEnvConfig 
  } = yield call(getOptions);
  
  if (mode === 'hash' && fromEnvironment === 'folder') {
    return;
  }

  // 'fromEnvironment' will always be specified
  logger.debug(`Creating ${fromEnvironment} temp folder ${fromEnvConfig.workingFolder}`);
  yield call(ensureDirSync, fromEnvConfig.workingFolder);

  // 'toEnvironment' will not be specified in hash mode
  if (toEnvironment) {
    logger.debug(`Creating ${toEnvironment} temp folder ${toEnvConfig.workingFolder}`);
    yield call(ensureDirSync, toEnvConfig.workingFolder);
  }

  logger.debug('Temp folders created');
}

export function* ensureCliAppsAreInstalled() {
  logger.debug('Checking that necessary CLI apps are installed');

  try {
    yield* REQUIRED_CLI_APPS.map(app => {
      logger.debug(`Checking if ${app} is installed`);
      return call(checkIfCliProgramIsInstalled, app);
    });
  } catch (err) {
    criticalFailure(err);
  }

  logger.debug('Necessary CLI apps are installed');
}
