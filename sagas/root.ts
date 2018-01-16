import * as fse from 'fs-extra'
import * as path from 'path'
import { call } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
const { red } = require('chalk')

import {
  options,
  REPO_INFO,
  DOCKER_CONTAINER_NAME,
  DOCKERFILE_FOLDER
} from '../configs'
import { criticalFailure } from '../lib'
import { bootstrap, teardown } from './bootstrap'
import {
  hashMode,
  packageMode,
  pushMode,
  verifyMode,
  versionMode
} from './modes'

export function* rootSaga(): SagaIterator {
  try {
    yield call(bootstrap)

    switch (options.mode) {
      case 'hash':
        yield call(hashMode)
        break
      case 'verify':
        yield call(verifyMode)
        break
      case 'package':
        yield call(packageMode)
        break
      case 'push':
        yield call(pushMode)
        break
      case 'version':
        yield call(versionMode)
        break
      default:
        throw new Error(`Unknown app mode ${options.mode}`)
    }

    yield call(teardown)
  } catch (err) {
    criticalFailure(err)
  }
}
