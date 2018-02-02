import * as fse from 'fs-extra'
import * as klaw from 'klaw'
import { createHash } from 'crypto'
import { spawn, exec } from 'child_process'
import { REPO_INFO } from '../configs'
import { relative } from 'path'

import { logger } from './logger'

export const runChildProcess = (cmd: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = spawn('sh', ['-c', cmd])
    const output: string[] = []

    child.stdout.on('data', (data: Buffer) => {
      logger.child(data.toString())
      output.push(data.toString())
    })

    child.stderr.on('data', (data: string) => {
      output.push(data)
    })

    child.on('close', (code: any) => {
      if (code !== 0) {
        return reject(`Child process exited with code: ${code}, ${output}`)
      }
      resolve(output.join(''))
    })
  })

export const cloneGitRepository = (
  repo: string,
  fullOutputPath: string
): Promise<string> => runChildProcess(`git clone ${repo} ${fullOutputPath}`)

export const checkoutGitBranch = (
  workingFolder: string,
  repoBranch: string
): Promise<string> =>
  runChildProcess(`cd ${workingFolder} && git checkout ${repoBranch}`)

export const checkoutGitCommit = (
  workingFolder: string,
  repoCommit: string
): Promise<string> =>
  runChildProcess(`cd ${workingFolder} && git checkout ${repoCommit}`)

export const gitNewBranch = (
  workingFolder: string,
  newBranchName: string
): Promise<string> =>
  runChildProcess(`cd ${workingFolder} && git checkout -b ${newBranchName}`)

export const gitCommit = (
  workingFolder: string,
  commitMessage: string
): Promise<string> =>
  runChildProcess(`cd ${workingFolder} && git commit -m "${commitMessage}"`)

export const gitPushOrigin = (
  workingFolder: string,
  branchName: string
): Promise<string> =>
  runChildProcess(`cd ${workingFolder} && git push origin ${branchName}`)

export const gitAddDistFolder = (
  workingFolder: string,
  distFolder: string
): Promise<string> =>
  runChildProcess(`cd ${workingFolder} && git add ${distFolder}/*`)

export const gitRemoveFolder = (
  workingFolder: string,
  distFolder: string
): Promise<string> =>
  runChildProcess(`cd ${workingFolder} && git rm -r ${distFolder}`)

export const buildDockerImage = (
  folder: string,
  dockerName: string
): Promise<string> =>
  runChildProcess(`docker build ${folder} --tag ${dockerName}`)

export const buildProjectWithDocker = (
  hostFolder: string,
  dockerName: string,
  buildCommand: string
): Promise<string> =>
  runChildProcess(`docker run -v ${hostFolder}:/appDir ${dockerName} "${buildCommand}"`)

export const calcSha256FromPath = (filePath: string): Promise<string> =>
  new Promise(async (resolve, reject) => {
    const stats = await fse.lstat(filePath)

    if (stats.isDirectory()) {
      return resolve('')
    }

    const hash = createHash('sha256')
    const input = fse.createReadStream(filePath)

    input.on('readable', () => {
      const data = input.read()
      if (data) {
        hash.update(data)
      } else {
        resolve(hash.digest('hex'))
      }
    })

    input.on('error', err => {
      reject(err)
    })
  })

export interface IFileInfoA {
  path: string
}

export const enumerateFilesInDir = (dirPath: string): Promise<IFileInfoA[]> =>
  new Promise((resolve, reject) => {
    const contents: IFileInfoA[] = []

    klaw(dirPath)
      .on('data', item => contents.push(item))
      .on('end', () => resolve(contents))
      .on('error', err => reject(err))
  })

export interface IFileInfoB extends IFileInfoA {
  basePath: string
  relativePath: string
}

export const normalizeEnumerateFiles = (
  basePath: string,
  files: IFileInfoA[]
): IFileInfoB[] =>
  files.map(file => ({
    basePath,
    path: file.path,
    relativePath: file.path.split(basePath)[1]
  }))

export interface IFileInfoC extends IFileInfoB {
  hash: string
}

export const addFileSha256 = (files: IFileInfoB[]): Promise<IFileInfoC[]> =>
  Promise.all(
    files.map(async file => ({
      ...file,
      hash: await calcSha256FromPath(file.path)
    }))
  )

export interface IFileInfoD extends IFileInfoC {
  fileOrFolder: string
}

export const addFileOrFolder = (files: IFileInfoC[]): Promise<IFileInfoD[]> =>
  Promise.all(
    files.map(async file => ({
      ...file,
      fileOrFolder: (await fse.lstat(file.path)).isDirectory()
        ? 'folder'
        : 'file'
    }))
  )
