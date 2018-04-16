import { call } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';

import { logger } from '../../lib';
import { calcRepoReportAndHash } from '../helpers';
import { getOptions } from '../../configs';
const { red, yellow, green } = require('chalk');


export function* verifyMode(): SagaIterator {
  const {
    fromEnvironment,
    fromBranch,
    fromCommit,
    toEnvironment,
    toBranch,
    toCommit
  } = yield call(getOptions);

  const repoFromHashRepot = yield call(calcRepoReportAndHash, fromEnvironment, fromBranch, fromCommit);
  const fromHash = repoFromHashRepot.hash;
  const fromReport = repoFromHashRepot.report;

  const repoToHashRepot = yield call(calcRepoReportAndHash, toEnvironment, toBranch, toCommit);
  const toHash = repoToHashRepot.hash;
  const toReport = repoToHashRepot.report;

  logger.succeed(`${fromEnvironment} hash:\t${yellow(fromHash)}`);
  logger.succeed(`${toEnvironment} hash:\t${yellow(toHash)}`);

  if (fromHash === toHash) {
    logger.succeed(green('Hashes are a match!'));
  } else {
    logger.fail(red('Hashes do not match!'));
  }
}
