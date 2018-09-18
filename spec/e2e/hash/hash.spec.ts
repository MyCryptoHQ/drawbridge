import { TEMP_DIR, EXPECTED_ROOT_HASH, GIT_DEVELOP_PATH } from './pretest';
import { resolveOnMockCall, resolveOnLineLogged, sleep, DB_TEST_CONFIG_1 } from '../helpers';


jest.setTimeout(15000);

const FINAL_LINE_REGEX = /.*produced a hash of.*/;

describe('hash mode', () => {
  const fromCommit = 'SOMEFAKECOMMIT';
  const DB_TEST_ARGS = `node drawbridge hash develop --fromCommit ${fromCommit}`.split(' ');
  const devEnv = DB_TEST_CONFIG_1.environments.develop;  

  let originalCwd;
  let originalArgs;
  let _logger;
  let _cloneGitRepository; 
  let _checkoutGitCommit; 
  let _buildDockerImage; 
  let _buildProjectWithDocker;
  let finalLine;

  beforeAll(async () => {
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
      buildDockerImage, 
      buildProjectWithDocker,
     } = require('../../../src/lib/children');

     _cloneGitRepository = cloneGitRepository;
     _checkoutGitCommit = checkoutGitCommit;
     _buildDockerImage = buildDockerImage;
     _buildProjectWithDocker = buildProjectWithDocker;

     finalLine = await resolveOnLineLogged(_logger, FINAL_LINE_REGEX);
  });

  afterAll(() => {
    process.argv = [...originalArgs];
    process.chdir(originalCwd);
  });

  it('should clone the configured git repo', () => {
    const expectedFirstArg = devEnv.gitUrl;
    const expectedSecondArg = GIT_DEVELOP_PATH;
    expect(_cloneGitRepository).toHaveBeenCalledTimes(1);
    expect(_cloneGitRepository.mock.calls[0][0]).toBe(expectedFirstArg);
    expect(_cloneGitRepository.mock.calls[0][1]).toBe(expectedSecondArg);
  });

  it('should checkout the configured commit', () => {
    const firstArg = GIT_DEVELOP_PATH;
    const secondArg = fromCommit;
    expect(_checkoutGitCommit).toHaveBeenCalledTimes(1);
    expect(_checkoutGitCommit.mock.calls[0][0]).toBe(firstArg);
    expect(_checkoutGitCommit.mock.calls[0][1]).toBe(secondArg);
  });

  it('should build the docker image', () => {
    expect(_buildDockerImage).toHaveBeenCalledTimes(1);
  });

  it('should build project with configured dev command', () => {
    const firstArg = GIT_DEVELOP_PATH;
    const thirdArg = devEnv.buildCommand;
    expect(_buildProjectWithDocker).toHaveBeenCalledTimes(1);
    expect(_buildProjectWithDocker.mock.calls[0][0]).toBe(firstArg);
    expect(_buildProjectWithDocker.mock.calls[0][2]).toBe(thirdArg);
  });

  it('should log the expected hash', () => {
    const expectedRegex = new RegExp(`.*${EXPECTED_ROOT_HASH}.*`);
    expect(expectedRegex.test(finalLine)).toBe(true);
  });
});