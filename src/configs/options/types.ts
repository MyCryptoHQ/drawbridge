export type TModes = 'verify' | 'hash' | 'package' | 'push' | 'version';

export interface IEnvironmentConfig {
  gitUrl: string;
  distFolder: string;
  defaultBranch?: string;
  buildCommand?: string;
  dockerfileFolder?: string;
}

export interface IEnvironmentConfigs {
  [environment: string]: IEnvironmentConfig;
}

export interface IRcOptions {
  environments: IEnvironmentConfigs;
  fromBranch: string | null;
  fromCommit: string | null;
  toBranch: string | null;
  toCommit: string | null;
  newBranch: string | null;
  commitMessage: string | null;
  version: boolean | null;
  config: string;
  dockerfileFolder: string | null;
}

export interface IModeOptions {
  mode: TModes | null;
  modeState: {
    verify: boolean;
    hash: boolean;
    package: boolean;
    push: boolean;
    version: boolean;
  };
  fromEnvironment: string | 'folder';
  toEnvironment: string;
  folder: string | null;
}

export interface IDerivedOptions {
  fromEnvConfig: IEnvironmentConfig;
  toEnvConfig: IEnvironmentConfig;
}

export type TModeAndRcOptions = IRcOptions & IModeOptions;
export type TOptions = TModeAndRcOptions & IDerivedOptions;

export interface INextIndexAndState {
  nextIndex: number;
  nextState: IModeOptions;
}

