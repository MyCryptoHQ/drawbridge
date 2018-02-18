import { expect } from 'chai'
import * as R from 'ramda'
import {
  INextIndexAndState,
  IOptions,
  TRepos,
  TModes,
  TSingleArg
} from './types'
import { criticalFailure } from '../../lib'

const { mergeDeepRight, clone } = R
const { red, yellow } = require('chalk')

export const VALID_REPO_OPTIONS: TRepos[] = [
  'develop',
  'staging',
  'prod',
  'beta'
]

export function parseArgAndSetState(
  index: number,
  state: IOptions,
  argv: string[]
): INextIndexAndState {
  const currentArg = argv[index]

  switch (currentArg) {
    case 'verify':
      return processVerify(index, state, argv)

    case 'hash':
      return processHash(index, state, argv)

    case 'package':
      return processPackage(index, state, argv)

    case 'push':
      return processPush(index, state, argv)

    case 'version':
      return processVersion(index, state, argv)

    case '--developBranch':
      return processDevelopBranch(index, state, argv)

    case '--developCommit':
      return processDevelopCommit(index, state, argv)

    case '--stagingBranch':
      return processStagingBranch(index, state, argv)

    case '--stagingCommit':
      return processStagingCommit(index, state, argv)

    case '--prodBranch':
      return processProdBranch(index, state, argv)

    case '--prodCommit':
      return processProdCommit(index, state, argv)

    case '--betaBranch':
      return processBetaBranch(index, state, argv)

    case '--betaCommit':
      return processBetaCommit(index, state, argv)

    case '--newBranch':
      return proccessNewBranch(index, state, argv)

    case '--commitMessage':
      return processCommitMessage(index, state, argv)

    case '--logLevel':
      return processLogLevel(index, state, argv)

    case '--preset':
      return processPreset(index, state, argv)

    default:
      criticalFailure(`Unknown option ${currentArg} in CLI arguments`)
      // won't reach this return in practice, but makes TS happy
      return { nextState: state, nextIndex: ++index }
  }
}

const genModeHandler = (targetMode: TModes, prep: 'against' | 'to') => (
  index: number,
  state: IOptions,
  argv: string[]
): INextIndexAndState => {
  const mode = argv[index]
  const repoFrom = argv[++index]
  const againstOrTo = argv[++index]
  const repoTo = argv[++index]

  expect(mode).to.equal(targetMode)
  expect(VALID_REPO_OPTIONS).to.contain(repoFrom)
  expect(againstOrTo).to.equal(prep)
  expect(VALID_REPO_OPTIONS).to.contain(repoTo)

  const nextState: IOptions = mergeDeepRight(state, {
    mode,
    repoFrom,
    repoTo
  })
  const nextIndex = ++index
  nextState.modeState[targetMode] = true

  return { nextIndex, nextState }
}

const genSingleArgHandler = (flagTarget: TSingleArg) => (
  index: number,
  state: IOptions,
  argv: string[]
): INextIndexAndState => {
  const flagRaw = argv[index]
  const flagValue = argv[++index]
  const flagFull = `--${flagTarget}`

  expect(flagRaw).to.equal(flagFull)
  expect(flagValue).to.be.a('string')
  expect(flagValue).to.have.lengthOf.at.least(1)

  const nextState: IOptions = clone(state)
  const nextIndex = ++index
  nextState[flagTarget] = flagValue

  return { nextState, nextIndex }
}

const processVerify = genModeHandler('verify', 'to')

const processPackage = genModeHandler('package', 'to')

const processPush = genModeHandler('push', 'to')

const processDevelopBranch = genSingleArgHandler('developBranch')

const processDevelopCommit = genSingleArgHandler('developCommit')

const processStagingBranch = genSingleArgHandler('stagingBranch')

const processStagingCommit = genSingleArgHandler('stagingCommit')

const processProdBranch = genSingleArgHandler('prodBranch')

const processProdCommit = genSingleArgHandler('prodCommit')

const processBetaBranch = genSingleArgHandler('betaBranch')

const processBetaCommit = genSingleArgHandler('betaCommit')

const proccessNewBranch = genSingleArgHandler('newBranch')

const processCommitMessage = genSingleArgHandler('commitMessage')

const processPreset = genSingleArgHandler('preset')

function processHash(
  index: number,
  state: IOptions,
  argv: string[]
): INextIndexAndState {
  const mode = argv[index]
  const hashRepo = argv[++index]

  expect(mode).to.equal('hash')
  expect([...VALID_REPO_OPTIONS, 'folder']).to.contain(hashRepo)

  const nextState = mergeDeepRight(state, {
    mode,
    hashRepo,
    modeState: {
      ...state.modeState,
      hash: true
    }
  })

  if (hashRepo === 'folder') {
    const folderPath = argv[++index]
    expect(folderPath).to.be.a('string')
    expect(folderPath).to.have.lengthOf.at.least(1)

    nextState.hashFolder = folderPath
  }

  const nextIndex = ++index

  return { nextIndex, nextState }
}

function processVersion(
  index: number,
  state: IOptions,
  argv: string[]
): INextIndexAndState {
  const mode = argv[index]

  expect(mode).to.equal('version')

  const nextState = mergeDeepRight(state, { mode })
  const nextIndex = ++index

  return { nextIndex, nextState }
}

function processLogLevel(
  index: number,
  state: IOptions,
  argv: string[]
): INextIndexAndState {
  const flag = argv[index]
  const modifier = argv[++index] as IOptions['logLevel']
  const expectedFlag = '--logLevel'
  const expectedModfiers = ['normal', 'debug']

  if (flag !== expectedFlag) {
    throw new Error(expectedToEqualErr(flag, expectedFlag))
  }

  if (expectedModfiers.indexOf(modifier) === -1) {
    throw new Error(expectedToEqualErr(modifier, expectedModfiers.join(', ')))
  }

  const nextState: IOptions = {
    ...state,
    logLevel: modifier
  }
  const nextIndex = ++index

  return { nextIndex, nextState }
}

const expectedToEqualErr = (expected: string, actual: string) =>
  red(`Expected ${yellow(expected)} to equal ${yellow(actual)}`)
