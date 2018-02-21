import { getRepoInfo, DOCKER_CONTAINER_NAME, DOCKERFILE_FOLDER } from '../configs';
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
import { TRepos } from '../configs/options/types';

const { yellow } = require('chalk');

export function* cloneAndBuildProject(
  repo: TRepos,
  repoBranch: string | null,
  repoCommit: string | null
): SagaIterator {
  const REPO_INFO = yield call(getRepoInfo);
  const isDevelop = repo === 'develop';
  const { gitUrl, workingFolder } = REPO_INFO[repo];

  try {
    logger.log(`Cloning ${yellow(repo)}, watch for SSH password prompt`);
    yield call(cloneGitRepository, gitUrl, workingFolder);
    logger.succeed(`Cloned ${yellow(repo)} to ${yellow(workingFolder)}`);
    if (!!repoBranch) {
      yield call(checkoutGitBranch, workingFolder, repoBranch);
      logger.succeed(`Checked out branch ${yellow(repoBranch)} on repo ${yellow(repo)}`);
    }
    if (!!repoCommit) {
      yield call(checkoutGitCommit, workingFolder, repoCommit);
      logger.succeed(`Checked out commit ${yellow(repoCommit)} on repo ${yellow(repo)}`);
    }
    if (isDevelop) {
      yield call(buildDevelop);
    }
  } catch (err) {
    criticalFailure(err);
  }
}

export function* buildDevelop(): SagaIterator {
  const REPO_INFO = yield call(getRepoInfo);
  const { workingFolder, buildCommand } = REPO_INFO.develop;
  try {
    logger.log('Building Docker image');
    yield call(buildDockerImage, DOCKERFILE_FOLDER, DOCKER_CONTAINER_NAME);
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
  repo: TRepos,
  repoBranch: string | null,
  repoCommit: string | null
): SagaIterator {
  const REPO_INFO = yield call(getRepoInfo);
  const { distFolder } = REPO_INFO[repo];
  yield call(cloneAndBuildProject, repo, repoBranch, repoCommit);
  return yield call(genDirectoryContentReport, distFolder);
}

export function* calcRepoReportAndHash(repo: TRepos, repoBranch: string, repoCommit: string) {
  const report = yield call(cloneBuildReport, repo, repoBranch, repoCommit);
  require('fs').writeFileSync('./CLONE_BUILD_REPORT.json', JSON.stringify(report, null, 2), 'utf8')
  const hash = yield call(calcFileInfoContentHash, report);
  return { report, hash };
}
