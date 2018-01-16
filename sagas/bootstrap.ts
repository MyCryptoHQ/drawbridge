import * as fse from 'fs-extra'
import { call } from 'redux-saga/effects'
import {
  logger,
  printWelcomeMessage,
  startLogWriteInterval,
  clearLogWriteInterval,
  criticalFailure,
  checkIfCliProgramIsInstalled
} from '../lib'

import { REPO_INFO, REQUIRED_CLI_APPS } from '../configs'

const { ensureDirSync } = fse
const { develop, staging, prod } = REPO_INFO

export function* bootstrap() {
  try {
    yield call(printWelcomeMessage)
    yield call(ensureCliAppsAreInstalled)
    yield call(ensureTempFolders)
    yield call(startLogWriteInterval)
  } catch (err) {
    criticalFailure(err)
  }

  logger.succeed('Bootstrapped')
}

export function* teardown() {
  yield call(clearLogWriteInterval)
}

export function* ensureTempFolders() {
  // develop
  logger.debug(`Creating develop temp folder ${develop.workingFolder}`)
  yield call(ensureDirSync, develop.workingFolder)

  // staging
  logger.debug(`Creating staging temp folder ${staging.workingFolder}`)
  yield call(ensureDirSync, staging.workingFolder)

  // prod
  logger.debug(`Creating prod temp folder ${prod.workingFolder}`)
  yield call(ensureDirSync, prod.workingFolder)

  logger.debug('Temp folders created')
}

export function* ensureCliAppsAreInstalled() {
  logger.debug('Checking that necessary CLI apps are installed')

  try {
    yield* REQUIRED_CLI_APPS.map(app => {
      logger.debug(`Checking if ${app} is installed`)
      return call(checkIfCliProgramIsInstalled, app)
    })
  } catch (err) {
    criticalFailure(err)
  }

  logger.debug('Necessary CLI apps are installed')
}
