
import * as path from 'path';
import { tmpdir } from 'os';

import * as fse from 'fs-extra';

import { mockAllRunChildProcess, mockLogger, DB_TEST_CONFIG_1 } from '../helpers';

export const DRAWBRIDGE_SOURCE_FOLDER = path.resolve(__dirname, '../../../');
export const SESSION_ID = Math.random()
  .toString()
  .substring(7);
export const TEMP_DIR = path.resolve(tmpdir(), 'drawbridge-tests', SESSION_ID);
export const DB_CONFIG_PATH = path.resolve(TEMP_DIR, '.drawbridgerc');
export const GIT_DEVELOP_PATH = path.resolve(TEMP_DIR, 'develop');
export const GIT_PROD_PATH = path.resolve(TEMP_DIR, 'prod');
export const DEVELOP_DIST_PATH = path.resolve(GIT_DEVELOP_PATH, DB_TEST_CONFIG_1.environments.develop.distFolder);
export const PROD_DIST_PATH = path.resolve(GIT_PROD_PATH, DB_TEST_CONFIG_1.environments.prod.distFolder);
export const MOCK_DEVELOP_FILES = {
  files: [{
    filename: 'fileA',
    fullPath: path.join(DEVELOP_DIST_PATH, 'fileA'),
    content: 'this is test fileA!'
  }, {
    filename: 'fileB',
    fullPath: path.join(DEVELOP_DIST_PATH, 'fileB'),
    content: 'this is test fileB!'
  }],
  rootHash: '379056ac1e4f8929b3c8472f5f79da0be3a23cf32802bec4a39c5371f256d752'
};


fse.ensureDirSync(TEMP_DIR);
fse.writeFileSync(DB_CONFIG_PATH, JSON.stringify(DB_TEST_CONFIG_1, null, 2), 'utf8');
fse.ensureDirSync(DEVELOP_DIST_PATH);
fse.ensureDirSync(PROD_DIST_PATH);

for (const { fullPath, content } of MOCK_DEVELOP_FILES.files) {
  fse.writeFileSync(fullPath, content, 'utf8');
}

process.env.DRAWBRIDGE_SOURCE_FOLDER = DRAWBRIDGE_SOURCE_FOLDER;
process.env.DRAWBRIDGE_SESSION_FOLDER = TEMP_DIR;

mockAllRunChildProcess();
mockLogger();