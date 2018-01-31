export type TRepos = 'develop' | 'staging' | 'prod'
export type TModes = 'verify' | 'hash' | 'package' | 'push' | 'version'
export type TSingleArg =
  | 'developBranch'
  | 'developCommit'
  | 'stagingBranch'
  | 'stagingCommit'
  | 'prodBranch'
  | 'prodCommit'
  | 'newBranch'
  | 'commitMessage'
  | 'preset'

export interface IOptions { 
  logLevel: 'debug' | 'normal'
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
