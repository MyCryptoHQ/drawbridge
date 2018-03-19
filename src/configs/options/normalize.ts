import * as path from 'path';

import * as R from 'ramda';
const { mergeDeepRight } = R;

import { TOptions, TModeAndRcOptions, IModeOptions, IRcOptions, IEnvironmentConfigs } from './types';
import { SESSION_FOLDER, DOCKERFILE_FOLDER } from '../constants';


export function normalizeAndMergeOptions(
  mode: IModeOptions,
  rc: IRcOptions
): TOptions {
  const sanitizedRc = sanitizeRcOptions(rc);
  const normalizedRc = normalizeRcOptions(sanitizedRc);
  const { environments, dockerfileFolder } = normalizedRc;
  const { fromEnvironment, toEnvironment } = mode;

  const mergedConfig: TModeAndRcOptions = {
    ...normalizedRc,
    ...mode
  };

  const dockerfileAdded = normDockerfileConfig(mergedConfig);
  const defaultBranchSet = normDefaultBranch(dockerfileAdded);
  const envConfigAdded = addEnvConfig(dockerfileAdded);

  return envConfigAdded;
}


function normDefaultBranch(config: TModeAndRcOptions): TModeAndRcOptions {
  const newConfig = mergeDeepRight(config, {});  
  const { environments, fromEnvironment, toEnvironment, fromBranch, fromCommit, toBranch, toCommit } = config;
  const fromEnvConfig = environments[fromEnvironment];
  const toEnvConfig = environments[toEnvironment];

  const newFromBranch = fromEnvConfig.defaultBranch && !fromBranch && !fromCommit
    ? fromEnvConfig.defaultBranch
    : fromBranch;

  newConfig.fromBranch = newFromBranch;

  if (toEnvConfig) {
    const newToBranch = toEnvConfig.defaultBranch && !toBranch && !toCommit
      ? toEnvConfig.defaultBranch
      : toBranch;

    newConfig.toBranch = newToBranch;
  }

  return newConfig;
}

function normDockerfileConfig(config: TModeAndRcOptions): TModeAndRcOptions {
  const newConfig = mergeDeepRight(config, {});
  const { dockerfileFolder, environments, fromEnvironment, toEnvironment } = config;
  const fromEnvConfig = environments[fromEnvironment];
  const toEnvConfig = environments[toEnvironment];


  const fromDockerfile = fromEnvConfig.buildCommand
    ? fromEnvConfig.dockerfileFolder || dockerfileFolder || DOCKERFILE_FOLDER
    : null;

  newConfig.environments[fromEnvironment].dockerfileFolder = fromDockerfile;
  
  // not defined in mode 'hash'
  if (toEnvConfig) {
    const toDockerfile = toEnvConfig.buildCommand
      ? toEnvConfig.dockerfileFolder || dockerfileFolder || DOCKERFILE_FOLDER
      : null;

    newConfig.environments[toEnvironment].dockerfileFolder = toDockerfile;
  }

  return newConfig;
}

function addEnvConfig(config: TModeAndRcOptions): TOptions {
  const { fromEnvironment, toEnvironment, environments } = config;
  return {
    ...config,
    fromEnvConfig: environments[fromEnvironment],
    toEnvConfig: environments[toEnvironment] 
  };
}

function sanitizeRcOptions(rc: IRcOptions): IRcOptions {
  const {
    environments,
    fromBranch,
    fromCommit,
    toBranch,
    toCommit,
    newBranch,
    commitMessage,
    version,
    config,
    dockerfileFolder
  } = rc;

  return {
    environments,
    fromBranch,
    fromCommit,
    toBranch,
    toCommit,
    newBranch,
    commitMessage,
    version,
    config,
    dockerfileFolder
  };
}

function normalizeRcOptions(rc: IRcOptions): IRcOptions {
  const environments = Object.entries(rc.environments).reduce((accu, [envId, envConf]) => {
    const workingFolder = path.resolve(SESSION_FOLDER, envId);
    const adaptedEnvConf = {
      ...envConf,
      workingFolder,
      distFolder: envConf.distFolder
        ? path.resolve(workingFolder, envConf.distFolder)
        : path.resolve(workingFolder)
    };
    return { ...accu, [envId]: { ...adaptedEnvConf } };
  }, {});

  return {
    ...rc,
    environments
  };
}
