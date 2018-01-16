import { call } from 'redux-saga/effects'
const { red, yellow } = require('chalk')

import {
  cloneBuildReport,
  calcRepoReportAndHash,
  genDirectoryContentReport
} from '../helpers'
import { options } from '../../configs'
import { TRepos } from '../../configs/options/types'
import {
  calcFileInfoContentHash,
  criticalFailure,
  logger,
  constructHashMessage
} from '../../lib'

export function* hashMode() {
  const { hashRepo, hashFolder } = options

  if (hashRepo === 'folder') {
    yield call(calcFolderHash, hashFolder)
  } else {
    yield call(calcOnlyRepoHash, hashRepo)
  }
}

export function* calcOnlyRepoHash(repo: TRepos) {
  const repoBranch = options[`${repo}Branch`]
  const repoCommit = options[`${repo}Commit`]

  const { hash } = yield call(
    calcRepoReportAndHash,
    repo,
    repoBranch,
    repoCommit
  )

  logger.succeed(constructHashMessage(repo, hash, repoBranch, repoCommit))
}

export function* calcFolderHash(folderPath: string) {
  const report = yield call(genDirectoryContentReport, folderPath)

  const hash = yield call(calcFileInfoContentHash, report)

  logger.succeed(
    `Folder ${yellow(folderPath)} produced a hash of ${yellow(hash)}`
  )
}
