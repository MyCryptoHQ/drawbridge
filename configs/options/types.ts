export type TRepos = 'develop' | 'staging' | 'prod' | 'beta'
export type TModes = 'verify' | 'hash' | 'package' | 'push' | 'version'
export type TSingleArg =
  | 'developBranch'
  | 'developCommit'
  | 'stagingBranch'
  | 'stagingCommit'
  | 'prodBranch'
  | 'prodCommit'
  | 'betaBranch'
  | 'betaCommit'
  | 'newBranch'
  | 'commitMessage'
  | 'preset'

export interface EnvironmentConfig {
        [environment: string]: {
            gitUrl: string;
            buildCommand?: string;
            distFolder?: string;
        }
}

export interface IOptions {
  logLevel: 'debug' | 'normal'
  environments: EnvironmentConfig
  mode: TModes | null
  modeState: {
    verify: boolean
    hash: boolean
    package: boolean
    push: boolean
    version: boolean
  }

  developBranch: string | null
  developCommit: string | null

  stagingBranch: string | null
  stagingCommit: string | null

  prodBranch: string | null
  prodCommit: string | null

  betaBranch: string | null
  betaCommit: string | null

  repoFrom: TRepos | null
  repoTo: TRepos | null

  hashRepo: TRepos | 'folder' | null
  hashFolder: string | null

  commitMessage: string | null
  newBranch: string | null

  preset: string
}

export interface INextIndexAndState {
  nextIndex: number
  nextState: IOptions
}
