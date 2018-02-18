import { exec } from 'child_process'
import { createHash } from 'crypto'
import { logger, IFileInfoC } from '../lib'
import { TRepos } from '../configs/options/types'
import { IFileInfoD } from './children'
const { yellow } = require('chalk')

export const checkIfCliProgramIsInstalled = (cmd: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const tester = 'which'
    const failMsg = `App ${cmd} does not exist!`

    exec(`${tester} ${cmd}`, (err, stdout) => {
      if (err) {
        return reject(`${failMsg} ${err}`)
      }
      if (!stdout.length) {
        return reject(failMsg)
      }
      resolve()
    })
  })

export const criticalFailure = (msg: any) => {
  if (typeof msg === 'object' && msg.obj) {
    logger.fail(msg.msg)
  } else {
    logger.fail(msg)
  }
  process.exit(1)
}

export const sortFileInfo = (fileInfo: IFileInfoC[]): IFileInfoC[] =>
  fileInfo.sort((a, b) => {
    if (a.hash > b.hash) {
      return -1
    }
    if (a.hash < b.hash) {
      return 1
    }
    return 0
  })

export const calcFileInfoContentHash = (fileInfo: IFileInfoC[]) => {
  const sorted = sortFileInfo(fileInfo)
  const concatedHashes = sorted.reduce((acc, cur) => (acc += cur.hash), '')
  const hash = createHash('sha256')
  hash.update(concatedHashes)

  return hash.digest('hex')
}

export const constructHashMessage = (
  repo: TRepos,
  hash: string,
  repoBranch: string,
  repoCommit: string
) =>
  `Repo ${yellow(repo)}${repoBranch ? ` on branch ${yellow(repoBranch)}` : ''}${
    repoCommit ? ` from commit ${yellow(repoCommit)}` : ''
  } produced a hash of ${yellow(hash)}`

export const findUniqueBetweenFileInfos = (
  source: IFileInfoD[],
  compare: IFileInfoD[]
): IFileInfoD[] =>
  source.filter(sourceItem =>
    compare.reduce((found, compareItem) => {
      if (found) {
        return found
      }
      return sourceItem.relativePath === compareItem.relativePath
    }, false)
  )
