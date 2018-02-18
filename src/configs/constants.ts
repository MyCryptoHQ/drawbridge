import * as path from 'path';
import { EnvironmentConfig } from './options/types';

export const APP_NAME = 'drawbridge';
export const DOCKER_CONTAINER_NAME = 'drawbridge';
export const DOCKERFILE_FOLDER = path.resolve('./docker');
export const REQUIRED_CLI_APPS = ['git', 'node', 'npm', 'docker'];
export const TEMP_FOLDER_BASE = `/tmp/${APP_NAME}`;
export const SESSION_ID = Math.random()
  .toString(36)
  .substr(2, 10);
export const SESSION_FOLDER = path.resolve(TEMP_FOLDER_BASE, SESSION_ID);
export const SESSION_LOG_FILE = path.resolve(SESSION_FOLDER, 'log');

// const V3_REPO_INFO: IRepoInfo = {
//   develop: {
//     gitUrl: 'git@github.com:skubakdj/etherwallet.git',
//     workingFolder: path.resolve(SESSION_FOLDER, 'develop'),
//     distFolder: path.resolve(SESSION_FOLDER, 'develop', 'dist'),
//     buildCommand: 'npm install && npm run build'
//   },
//   staging: {
//     gitUrl: 'git@github.com:skubakdj/stagingMockTemp.git',
//     workingFolder: path.resolve(SESSION_FOLDER, 'staging'),
//     distFolder: path.resolve(SESSION_FOLDER, 'staging', 'docs')
//   },
//   prod: {
//     gitUrl: 'git@github.com:skubakdj/prodMockTemp.git',
//     workingFolder: path.resolve(SESSION_FOLDER, 'prod'),
//     distFolder: path.resolve(SESSION_FOLDER, 'prod', 'docs')
//   }
// };

let repoInfo = {};

export function setEnvironmentDefaults(environments: EnvironmentConfig) {
  repoInfo = Object.entries(environments).reduce((accu, [envId, envConf]) => {
    const defaultProperties = {
      distFolder: path.resolve(SESSION_FOLDER, envId, 'dist', 'prod'),
      workingFolder: path.resolve(SESSION_FOLDER, envId),
      buildCommand: 'npm install && npm run build'
    };
    return { ...accu, [envId]: { ...defaultProperties, ...envConf } };
  }, {});
}

export const getRepoInfo = () => repoInfo;
