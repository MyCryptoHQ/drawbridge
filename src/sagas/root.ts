import { call } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';

import { options } from '../configs';
import { criticalFailure } from '../lib';
import { bootstrap, teardown } from './bootstrap';
import { hashMode, packageMode, pushMode, verifyMode, versionMode } from './modes/index';

export function* rootSaga(): SagaIterator {
  try {
    yield call(bootstrap);

    switch (options.mode) {
      case 'hash':
        yield call(hashMode);
        break;
      case 'verify':
        yield call(verifyMode);
        break;
      case 'package':
        yield call(packageMode);
        break;
      case 'push':
        yield call(pushMode);
        break;
      case 'version':
        yield call(versionMode);
        break;
      default:
        throw new Error(`Unknown app mode ${options.mode}`);
    }

    yield call(teardown);
  } catch (err) {
    criticalFailure(err);
  }
}
