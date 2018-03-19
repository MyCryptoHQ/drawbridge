
import { call } from 'redux-saga/effects';
const { yellow } = require('chalk');

import { calcRepoReportAndHash, genDirectoryContentReport } from '../helpers';
import { getOptions } from '../../configs';
import { calcFileInfoContentHash, logger, constructHashMessage } from '../../lib';

export function* hashMode() {
  const { 
    fromEnvironment, 
    folder 
  } = yield call(getOptions);

  if (fromEnvironment === 'folder') {
    yield call(calcFolderHash, folder);
  } else {
    yield call(calcOnlyRepoHash, fromEnvironment);
  }
}

export function* calcOnlyRepoHash(environment: string) {
  const { 
    fromEnvironment, 
    fromBranch,
    fromCommit
  } = yield call(getOptions);

  const { hash } = yield call(calcRepoReportAndHash, environment, fromBranch, fromCommit);

  logger.succeed(constructHashMessage(environment, hash, fromBranch, fromCommit));
}

export function* calcFolderHash(folderPath: string) {
  const report = yield call(genDirectoryContentReport, folderPath);
  const hash = yield call(calcFileInfoContentHash, report);

  logger.succeed(`Folder ${yellow(folderPath)} produced a hash of ${yellow(hash)}`);
}
