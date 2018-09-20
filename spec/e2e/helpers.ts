
export function mockAllRunChildProcess() {
  jest.mock('../../src/lib/children', () => {
  const original = require.requireActual('../../src/lib/children');

  return {
    ...original,
    cloneGitRepository: jest.fn(),
    checkoutGitBranch: jest.fn(),
    checkoutGitCommit: jest.fn(),
    gitNewBranch: jest.fn(),
    gitCommit: jest.fn(),
    gitPushOrigin: jest.fn(),
    gitAddDistFolder: jest.fn(),
    gitRemoveFolder: jest.fn(),
    buildDockerImage: jest.fn(),
    buildProjectWithDocker: jest.fn()
  };
});
}

export function mockLogger() {
  jest.mock('../../src/lib/logger', () => {
    const original = require.requireActual('../../src/lib/logger');

    const loggedLines = [];
    const mockLog = (m: string) => loggedLines.push(m);
    const getLoggedLines = () => loggedLines;
  
    return {
      ...original,
      printWelcomeMessage: mockLog,
      logger: {
        log: mockLog,
        debug: mockLog,
        succeed: mockLog,
        fail: (m) => { console.log(m); mockLog(m); },
        file: mockLog,
        child: mockLog,
        getLoggedLines
      }
    };
  });
}

export const DB_TEST_CONFIG_1 = {
  environments: {
    develop: {
      gitUrl: 'git@github.com:fakeOrg/fakeRepo.git',
      distFolder: 'dist',
      buildCommand: 'npm run fake-build-command'
    },
    prod: {
      gitUrl: 'git@github.com:fakeOrg/fakeRepo.git',
      distFolder: ''
    }
  }
};

export const resolveOnMockCall = (mockFn: any, expectedNumCalls: number) =>
  new Promise(resolve => {
    const numCalls = mockFn.mock.calls.length + expectedNumCalls;
    const checkCalls = setInterval(() => {
      if (mockFn.mock.calls.length === numCalls) {
        clearInterval(checkCalls);
        resolve(mockFn.mock.calls);
      }
    }, 100);
  });

export const sleep = (interval: number) =>
  new Promise(resolve => {
    setTimeout(() => resolve(), interval);
  });

export function resolveOnLineLogged(logger, regex) {
  const { getLoggedLines } = logger;

  return new Promise(resolve => {
    setInterval(() => {
      getLoggedLines().forEach(line => {
        if (regex.test(line)) {
          resolve(line);
        }
      });
    }, 100);
  });
}

export async function calcFolderHash(folderPath: string) {
  const { 
    enumerateFilesInDir,
    normalizeEnumerateFiles,
    filterGitFiles,
    addFileSha256,
    addFileOrFolder
  } = require('../../src/lib/children');
  const { calcFileInfoContentHash } = require('../../src/lib/helpers');

  const files = await enumerateFilesInDir(folderPath);
  const normedFiles = await normalizeEnumerateFiles(folderPath, files);
  const gitFilesFiltered = await filterGitFiles(normedFiles);
  const fileWithHash = await addFileSha256(gitFilesFiltered);
  const fileOrFolder = await addFileOrFolder(fileWithHash);

  return calcFileInfoContentHash(fileOrFolder);
}