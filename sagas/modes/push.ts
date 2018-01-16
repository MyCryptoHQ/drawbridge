import { call } from 'redux-saga/effects'
import * as fse from 'fs-extra'
const { red, yellow } = require('chalk')

import {
  cloneBuildReport,
  calcRepoReportAndHash,
  genDirectoryContentReport,
  cloneAndBuildProject
} from '../helpers'
import { getOptions, getRepoInfo } from '../../configs'
import { TRepos, TSingleArg } from '../../configs/options/types'
import {
  calcFileInfoContentHash,
  criticalFailure,
  logger,
  constructHashMessage,
  gitNewBranch,
  gitCommit,
  gitPushOrigin,
  gitAddDistFolder
} from '../../lib'

import { packageFromAToB } from './package'
import { SagaIterator } from 'redux-saga'

export function* pushMode() {
  const { repoFrom, repoTo } = yield call(getOptions)

  if (repoFrom === 'develop' && repoTo === 'staging') {
    yield call(pushFromDevelopToStaging)
  } else if (repoFrom === 'staging' && repoTo === 'prod') {
    yield call(pushFromStagingToProd)
  } else {
    throw new Error(`Cannot package from repo ${repoFrom} to repo ${repoTo}`)
  }
}

export function* pushFromAToB(repoFrom: TRepos, repoTo: TRepos): SagaIterator {
  yield call(packageFromAToB, repoFrom, repoTo)

  const { commitMessage, newBranch } = yield call(getOptions)

  const repoInfo = yield call(getRepoInfo)
  const toDistFolder = repoInfo[repoTo].distFolder
  const toWorkingFolder = repoInfo[repoTo].workingFolder

  yield call(gitNewBranch, toWorkingFolder, newBranch)
  logger.succeed(
    `Checked out new branch ${yellow(newBranch)} on repo ${yellow(repoTo)}`
  )

  yield call(gitAddDistFolder, toWorkingFolder, toDistFolder)
  logger.succeed(`Staged ${yellow(toDistFolder)} for commit on repo ${repoTo}`)

  yield call(gitCommit, toWorkingFolder, commitMessage)
  logger.succeed(
    `Committed changes to branch ${yellow(newBranch)} on repo ${yellow(repoTo)}`
  )

  logger.log(
    `Pushing repo ${yellow(repoTo)} to ${yellow(
      'origin'
    )}, watch for SSH password prompt`
  )
  yield call(gitPushOrigin, toWorkingFolder, newBranch)
  logger.succeed(`Pushed repo ${yellow(repoTo)} to ${yellow('origin')}`)
}

export function* pushFromDevelopToStaging() {
  const repoFrom = 'develop'
  const repoTo = 'staging'

  yield call(pushFromAToB, repoFrom, repoTo)
}

export function* pushFromStagingToProd() {
  const repoFrom = 'staging'
  const repoTo = 'prod'

  yield call(pushFromAToB, repoFrom, repoTo)
}
