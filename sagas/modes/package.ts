
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
import { TRepos } from '../../configs/options/types';
import { 
  calcFileInfoContentHash,
  criticalFailure,
  logger,
  constructHashMessage
} from '../../lib'


export function* packageMode() {
  const { repoFrom, repoTo } = yield call(getOptions)

  if (repoFrom === 'develop' && repoTo === 'staging') {
    yield call(packageFromDevelopToStaging)
  } else if (repoFrom === 'staging' && repoTo === 'prod') {
    yield call(packageFromStagingToProd)
  } else {
    throw new Error(`Cannot package from repo ${
      repoFrom
    } to repo ${repoTo}`)
  }

  logger.succeed(`Repo ${yellow(repoTo)} is now populated with dist files from repo ${
    yellow(repoFrom)
  }. These changes can be manually committed to a branch and pushed into a PR`)
}


export function* packageFromAToB(
  repoFrom: TRepos,
  repoTo: TRepos
) {

  const options = yield call(getOptions)

  const fromBranch = options[`${repoFrom}Branch`]
  const fromCommit = options[`${repoFrom}Commit`]
  const toBranch = options[`${repoTo}Branch`]
  const toCommit = options[`${repoTo}Commit`]

  // clone and build fromBranch
  yield call(
    cloneAndBuildProject,
    repoFrom,
    fromBranch,
    fromCommit
  )

  // clone and build toBranch
  yield call(
    cloneAndBuildProject,
    repoTo,
    toBranch,
    toCommit
  )

  const repoInfo = yield call(getRepoInfo)
  const fromDistFolder = repoInfo[repoFrom].distFolder
  const toDistFolder = repoInfo[repoTo].distFolder

  logger.log(`Emptying repo ${yellow(repoTo)} dist folder`)
  yield call(fse.emptyDir, toDistFolder)
  logger.succeed(`Emptied repo ${yellow(repoTo)} dist folder`)

  logger.log(`Copying ${yellow(repoFrom)} to ${yellow(repoTo)}`)
  yield call(fse.copy, fromDistFolder, toDistFolder)
  logger.succeed(`Copied ${yellow(repoFrom)} [${yellow(fromDistFolder)}] to ${yellow(repoTo)} [${yellow(toDistFolder)}]`)

}

export function* packageFromDevelopToStaging() {
  const repoFrom = 'develop'
  const repoTo = 'staging'

  yield call(
    packageFromAToB,
    repoFrom,
    repoTo
  )
}

export function* packageFromStagingToProd() {
  const repoFrom = 'staging'
  const repoTo = 'prod'

  yield call(
    packageFromAToB,
    repoFrom,
    repoTo
  )
}

