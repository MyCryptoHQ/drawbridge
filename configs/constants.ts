import * as path from 'path'

import { getOptions } from './options'

export const APP_NAME = 'drawbridge'
export const DOCKER_CONTAINER_NAME = 'drawbridge'
export const DOCKERFILE_FOLDER = path.resolve('./docker')

export const REQUIRED_CLI_APPS = ['git', 'node', 'npm', 'docker']
export const TEMP_FOLDER_BASE = `/tmp/${APP_NAME}`
export const SESSION_ID = Math.random()
  .toString(36)
  .substr(2, 10)
export const SESSION_FOLDER = path.resolve(TEMP_FOLDER_BASE, SESSION_ID)
export const SESSION_LOG_FILE = path.resolve(SESSION_FOLDER, 'log')

interface IRepoInfo {
  develop: {
    gitUrl: string
    distFolder: string
    workingFolder: string
    buildCommand: string
  }
  staging: {
    gitUrl: string
    distFolder: string
    workingFolder: string
  }
  prod: {
    gitUrl: string
    distFolder: string
    workingFolder: string
  }
}

interface IRepoInfos {
  v3: IRepoInfo
  v4: IRepoInfo
}

const V3_REPO_INFO: IRepoInfo = {
  develop: {
    gitUrl: 'git@github.com:skubakdj/etherwallet.git',
    workingFolder: path.resolve(SESSION_FOLDER, 'develop'),
    distFolder: path.resolve(SESSION_FOLDER, 'develop', 'dist'),
    buildCommand: 'npm install && npm run build'
  },
  staging: {
    gitUrl: 'git@github.com:skubakdj/stagingMockTemp.git',
    workingFolder: path.resolve(SESSION_FOLDER, 'staging'),
    distFolder: path.resolve(SESSION_FOLDER, 'staging', 'docs')
  },
  prod: {
    gitUrl: 'git@github.com:skubakdj/prodMockTemp.git',
    workingFolder: path.resolve(SESSION_FOLDER, 'prod'),
    distFolder: path.resolve(SESSION_FOLDER, 'prod', 'docs')
  }
}

const V4_REPO_INFO: IRepoInfo = {
  develop: {
    gitUrl: 'git@github.com:MyCryptoHQ/MyCrypto.git',
    workingFolder: path.resolve(SESSION_FOLDER, 'develop'),
    distFolder: path.resolve(SESSION_FOLDER, 'develop', 'dist', 'prod'),
    buildCommand: 'npm install && npm run build'
  },
  staging: {
    gitUrl: 'git@github.com:skubakdj/stagingMockTemp.git',
    workingFolder: path.resolve(SESSION_FOLDER, 'staging'),
    distFolder: path.resolve(SESSION_FOLDER, 'staging', 'docs')
  },
  prod: {
    gitUrl: 'git@github.com:skubakdj/prodMockTemp.git',
    workingFolder: path.resolve(SESSION_FOLDER, 'prod'),
    distFolder: path.resolve(SESSION_FOLDER, 'prod', 'docs')
  }
}

export const REPO_INFOS: IRepoInfos = {
  v3: V3_REPO_INFO,
  v4: V4_REPO_INFO
}

export const getRepoInfo = () => REPO_INFOS[getOptions().preset]
