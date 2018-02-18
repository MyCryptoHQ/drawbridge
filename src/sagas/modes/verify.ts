import { call } from 'redux-saga/effects';
import { TRepos } from '../../configs/options/types';
import { SagaIterator } from 'redux-saga';

import { logger } from '../../lib';
import { calcRepoReportAndHash } from '../helpers';
import { getOptions } from '../../configs';
const { red, yellow, green } = require('chalk');

export function* verifyMode() {
  const { repoFrom, repoTo } = yield call(getOptions);

  if (repoFrom === 'develop' && repoTo === 'staging') {
    yield call(verifyStagingAgainstDevelop);
  } else if (repoFrom === 'staging' && repoTo === 'prod') {
    yield call(verifyProdAgainstStaging);
  } else if (repoFrom === 'develop' && repoTo === 'beta') {
    yield call(verifyBetaAgainstDevelop);
  } else {
    throw new Error(`Cannot verify repo ${repoFrom} against repo ${repoTo}`);
  }
}

export function* verifyAAgainstB(repoFrom: TRepos, repoTo: TRepos): SagaIterator {
  const options = yield call(getOptions);

  const fromBranch = options[`${repoFrom}Branch`];
  const fromCommit = options[`${repoFrom}Commit`];
  const toBranch = options[`${repoTo}Branch`];
  const toCommit = options[`${repoTo}Commit`];

  const repoFromHashRepot = yield call(calcRepoReportAndHash, repoFrom, fromBranch, fromCommit);
  const fromHash = repoFromHashRepot.hash;
  const fromReport = repoFromHashRepot.report;

  const repoToHashRepot = yield call(calcRepoReportAndHash, repoTo, toBranch, toCommit);
  const toHash = repoToHashRepot.hash;
  const toReport = repoToHashRepot.report;

  logger.succeed(`${repoFrom} hash:\t${yellow(fromHash)}`);
  logger.succeed(`${repoTo} hash:\t${yellow(toHash)}`);

  if (fromHash === toHash) {
    logger.succeed(green('Hashes are a match!'));
  } else {
    logger.fail(red('Hashes do not match!'));
  }
}

export function* verifyStagingAgainstDevelop(): SagaIterator {
  const repoFrom = 'develop';
  const repoTo = 'staging';

  yield call(verifyAAgainstB, repoFrom, repoTo);
}

export function* verifyProdAgainstStaging(): SagaIterator {
  const repoFrom = 'staging';
  const repoTo = 'prod';

  yield call(verifyAAgainstB, repoFrom, repoTo);
}

export function* verifyBetaAgainstDevelop(): SagaIterator {
  const repoFrom = 'develop';
  const repoTo = 'beta';

  yield call(verifyAAgainstB, repoFrom, repoTo);
}
