import { IRcOptions, IModeOptions } from './types';

export const defaultRcOptions: IRcOptions = {
  environments: {},
  fromBranch: null,
  fromCommit: null,
  toBranch: null,
  toCommit: null,
  newBranch: null,
  commitMessage: null,
  version: null,
  config: '',
  dockerfileFolder: null
};

export const defaultModeOptions: IModeOptions = {
  mode: null,
  modeState: {
    verify: false,
    hash: false,
    package: false,
    push: false,
    version: false
  },
  fromEnvironment: '',
  toEnvironment: '',
  folder: null
};
