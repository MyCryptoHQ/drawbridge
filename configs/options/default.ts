import { IOptions } from './types'

export const defaultOptions: IOptions = {
  logLevel: 'normal',
  mode: null,
  modeState: {
    verify: false,
    hash: false,
    package: false,
    push: false,
    version: false
  },
  developBranch: null,
  developCommit: null,
  stagingBranch: null,
  stagingCommit: null,
  prodBranch: null,
  prodCommit: null,
  betaBranch: null,
  betaCommit: null,
  repoFrom: null,
  repoTo: null,
  hashRepo: null,
  hashFolder: null,
  commitMessage: null,
  newBranch: null,
  preset: 'v4'
}
