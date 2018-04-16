import { getEnvConfig, DOCKER_CONTAINER_NAME, DOCKERFILE_FOLDER, getOptions } from '../configs';
import { call } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import {
  logger,
  cloneGitRepository,
  criticalFailure,
  enumerateFilesInDir,
  normalizeEnumerateFiles,
  addFileSha256,
  addFileOrFolder,
  calcFileInfoContentHash,
  buildDockerImage,
  buildProjectWithDocker,
  checkoutGitBranch,
  checkoutGitCommit,
  filterGitFiles
} from '../lib';

const { yellow } = require('chalk');

export function* cloneAndBuildProject(
  environment: string,
  envBranch: string | null,
  envCommit: string | null
): SagaIterator {
  const { gitUrl, workingFolder, buildCommand } = yield call(getEnvConfig, environment);

  try {
    logger.log(`Cloning ${yellow(environment)}, watch for SSH password prompt`);
    yield call(cloneGitRepository, gitUrl, workingFolder);
    logger.succeed(`Cloned ${yellow(environment)} to ${yellow(workingFolder)}`);
    if (!!envBranch) {
      yield call(checkoutGitBranch, workingFolder, envBranch);
      logger.succeed(`Checked out branch ${yellow(envBranch)} from environment ${yellow(environment)}`);
    }
    if (!!envCommit) {
      yield call(checkoutGitCommit, workingFolder, envCommit);
      logger.succeed(`Checked out commit ${yellow(envCommit)} from environment ${yellow(environment)}`);
    }
    if (buildCommand) {
      yield call(buildProject, environment);
    }
  } catch (err) {
    criticalFailure(err);
  }
}

export function* buildProject(environment: string): SagaIterator {
  const { workingFolder, buildCommand, dockerfileFolder } = yield call(getEnvConfig, environment);

  try {
    logger.log('Building Docker image');
    yield call(buildDockerImage, dockerfileFolder, DOCKER_CONTAINER_NAME);
    logger.succeed('Built Docker image');
    logger.log(`Building ${yellow('develop')} with Docker`);
    yield call(buildProjectWithDocker, workingFolder, DOCKER_CONTAINER_NAME, buildCommand);
    logger.succeed(`Built ${yellow('develop')} with Docker`);
  } catch (err) {
    criticalFailure(err);
  }
}

export function* genDirectoryContentReport(directory: string): SagaIterator {
  try {
    logger.log(`Analyzing files in ${yellow(directory)}`);

    const files = yield call(enumerateFilesInDir, directory);
    logger.debug('Files enumerated');

    const normedFiles = yield call(normalizeEnumerateFiles, directory, files);
    logger.debug('Files normalized');

    const gitFilesFiltered = yield call(filterGitFiles, normedFiles);
    logger.debug('Files filtered of git files');

    const fileWithHash = yield call(addFileSha256, gitFilesFiltered);
    logger.debug('Files hashed');

    const fileOrFolder = yield call(addFileOrFolder, fileWithHash);

    logger.succeed(`Analyzed directory ${yellow(directory)}`);

    return fileOrFolder;
  } catch (err) {
    criticalFailure(err);
  }
}

export function* cloneBuildReport(
  environment: string,
  envBranch: string | null,
  envCommit: string | null
): SagaIterator {
  const { environments } = yield call(getOptions);
  const { distFolder } = environments[environment];
  yield call(cloneAndBuildProject, environment, envBranch, envCommit);
  return yield call(genDirectoryContentReport, distFolder);
}

export function* calcRepoReportAndHash(environment: string, envBranch: string, envCommit: string) {
  const report = yield call(cloneBuildReport, environment, envBranch, envCommit);
  const hash = yield call(calcFileInfoContentHash, report);
  return { report, hash };
}
