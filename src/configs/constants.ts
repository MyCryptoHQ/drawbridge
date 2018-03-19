import * as path from 'path';

export const APP_NAME = 'drawbridge';
export const DRAWBRIDGE_SOURCE_FOLDER = process.env.DRAWBRIDGE_SOURCE_FOLDER;
export const DOCKER_CONTAINER_NAME = 'drawbridge';
export const DOCKERFILE_FOLDER = path.resolve(DRAWBRIDGE_SOURCE_FOLDER, 'docker');
export const REQUIRED_CLI_APPS = ['git', 'node', 'npm', 'docker'];
export const TEMP_FOLDER_BASE = `/tmp/${APP_NAME}`;
export const SESSION_ID = Math.random()
  .toString(36)
  .substr(2, 10);
export const SESSION_FOLDER = path.resolve(TEMP_FOLDER_BASE, SESSION_ID);
export const SESSION_LOG_FILE = path.resolve(SESSION_FOLDER, 'log');
export const RC_PROPERTIES_WHITELIST = [
  'fromBranch',
  'fromCommit',
  'toBranch',
  'toCommit',
  'newBranch',
  'commitMessage',
  'version',
  'config',
  'configs',
  'environments',
  '_',
  'SOURCE_FOLDER'
];
