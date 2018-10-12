import * as path from 'path';

import { TEMP_DIR, GIT_DEVELOP_PATH, GIT_PROD_PATH, DEVELOP_DIST_PATH, PROD_DIST_PATH, MOCK_DEVELOP_FILES } from './pretest';
import { resolveOnMockCall, resolveOnLineLogged, sleep, DB_TEST_CONFIG_1, calcFolderHash } from '../helpers';


jest.setTimeout(15000);

const FINAL_LINE_REGEX = /^Pushed repo.*/;

describe('push mode', () => {
  const fromCommit = 'SOMEFAKEFROMCOMMIT';
  // const toCommit = 'SOMEFAKETOCOMMIT';
  const newBranch = 'new-branch-name';
  const commitMessage = 'some-commit-message';

  const DB_TEST_ARGS = `node drawbridge push develop to prod --fromCommit ${fromCommit} --newBranch ${newBranch} --commitMessage ${commitMessage}`.split(' ');
  const devEnv = DB_TEST_CONFIG_1.environments.develop;  
  const prodEnv = DB_TEST_CONFIG_1.environments.prod;

  let originalCwd;
  let originalArgs;
  let _logger;
  let _cloneGitRepository; 
  let _checkoutGitCommit; 
  let _gitNewBranch;
  let _gitCommit;
  let _gitPushOrigin;
  let _gitAddDistFolder;
  let _gitRemoveFolder;
  let _buildDockerImage; 
  let _buildProjectWithDocker;

  beforeAll(async () => {
    jest.clearAllMocks();

    // modify env for drawbridge
    originalCwd = process.cwd();
    originalArgs = [...process.argv];
    process.chdir(TEMP_DIR);
    process.argv = DB_TEST_ARGS;

    // fire up drawbridge
    require('../../../src/index');
    _logger = require('../../../src/lib/logger').logger;

    const { 
      cloneGitRepository,
      checkoutGitCommit,
      gitNewBranch,
      gitCommit,
      gitPushOrigin,
      gitAddDistFolder,
      gitRemoveFolder,
      buildDockerImage, 
      buildProjectWithDocker,
     } = require('../../../src/lib/children');

     _cloneGitRepository = cloneGitRepository;
     _checkoutGitCommit = checkoutGitCommit;
     _gitNewBranch = gitNewBranch;
     _gitCommit = gitCommit;
     _gitPushOrigin = gitPushOrigin;
     _gitAddDistFolder = gitAddDistFolder;
     _gitRemoveFolder = gitRemoveFolder;
     _buildDockerImage = buildDockerImage;
     _buildProjectWithDocker = buildProjectWithDocker;

     await resolveOnLineLogged(_logger, FINAL_LINE_REGEX);
  });

  afterAll(() => {
    process.argv = [...originalArgs];
    process.chdir(originalCwd);
  });

  it('should clone the develop git repo', () => {
    const expectedFirstArg = devEnv.gitUrl;
    const expectedSecondArg = GIT_DEVELOP_PATH;
    expect(_cloneGitRepository).toHaveBeenCalledTimes(2);
    expect(_cloneGitRepository.mock.calls[0][0]).toBe(expectedFirstArg);
    expect(_cloneGitRepository.mock.calls[0][1]).toBe(expectedSecondArg);
  });

  it('should checkout the develop commit', () => {
    const firstArg = GIT_DEVELOP_PATH;
    const secondArg = fromCommit;
    expect(_checkoutGitCommit).toHaveBeenCalledTimes(1);
    expect(_checkoutGitCommit.mock.calls[0][0]).toBe(firstArg);
    expect(_checkoutGitCommit.mock.calls[0][1]).toBe(secondArg);
  });

  it('should build the docker image', () => {
    expect(_buildDockerImage).toHaveBeenCalledTimes(1);
  });

  it('should build develop with configured build command', () => {
    const firstArg = GIT_DEVELOP_PATH;
    const thirdArg = devEnv.buildCommand;
    expect(_buildProjectWithDocker).toHaveBeenCalledTimes(1);
    expect(_buildProjectWithDocker.mock.calls[0][0]).toBe(firstArg);
    expect(_buildProjectWithDocker.mock.calls[0][2]).toBe(thirdArg);
  });

  it('should clone the prod repo', () => {
    const expectedFirstArg = prodEnv.gitUrl;
    const expectedSecondArg = GIT_PROD_PATH;
    expect(_cloneGitRepository).toHaveBeenCalledTimes(2);
    expect(_cloneGitRepository.mock.calls[1][0]).toBe(expectedFirstArg);
    expect(_cloneGitRepository.mock.calls[1][1]).toBe(expectedSecondArg);
  });

  it('should checkout new branch on prod repo', () => {
    const workingFolder = GIT_PROD_PATH;

    expect(_gitNewBranch).toHaveBeenCalledTimes(1);
    expect(_gitNewBranch.mock.calls[0][0]).toBe(workingFolder);
    expect(_gitNewBranch.mock.calls[0][1]).toBe(newBranch);
  });

  it('should git rm the old prod dist folder', () => {
    const workingFolder = GIT_PROD_PATH;
    const distFolder = path.resolve(GIT_PROD_PATH, prodEnv.distFolder);

    expect(_gitRemoveFolder).toHaveBeenCalledTimes(1);
    expect(_gitRemoveFolder.mock.calls[0][0]).toBe(workingFolder);
    expect(_gitRemoveFolder.mock.calls[0][1]).toBe(distFolder);
    
  });

  it('should git add the new prod dist folder', () => {
    const workingFolder = GIT_PROD_PATH;
    const distFolder = path.resolve(GIT_PROD_PATH, prodEnv.distFolder);

    expect(_gitAddDistFolder).toHaveBeenCalledTimes(1);
    expect(_gitAddDistFolder.mock.calls[0][0]).toBe(workingFolder);
    expect(_gitAddDistFolder.mock.calls[0][1]).toBe(distFolder);
  });

  it('should git commit the changes to prod', () => {
    const workingFolder = GIT_PROD_PATH;

    expect(_gitCommit).toHaveBeenCalledTimes(1);
    expect(_gitCommit.mock.calls[0][0]).toBe(workingFolder);
    expect(_gitCommit.mock.calls[0][1]).toBe(commitMessage);
  });

  it('should git push the changes to prod', () => {
    const workingFolder = GIT_PROD_PATH;

    expect(_gitPushOrigin).toHaveBeenCalledTimes(1);
    expect(_gitPushOrigin.mock.calls[0][0]).toBe(workingFolder);
    expect(_gitPushOrigin.mock.calls[0][1]).toBe(newBranch);
   
  });

  it('the root hash of develop dist should match prod dist', async () => {
    const expectedRootHash = MOCK_DEVELOP_FILES.rootHash;
    const developRootHash = await calcFolderHash(DEVELOP_DIST_PATH);
    const prodRootHash = await calcFolderHash(PROD_DIST_PATH);
    expect(developRootHash).toEqual(expectedRootHash);
    expect(prodRootHash).toEqual(expectedRootHash);
  });
});