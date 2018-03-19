import { expect } from 'chai';
import * as R from 'ramda';

import { INextIndexAndState, IModeOptions, TModes } from './types';
import { criticalFailure } from '../../lib';

const { mergeDeepRight, clone } = R;
const { red, yellow } = require('chalk');

export function parseArgAndSetState(
  index: number,
  state: IModeOptions,
  argv: string[]
): INextIndexAndState {
  const currentArg = argv[index];

  switch (currentArg) {
    case 'verify':
      return processVerify(index, state, argv);

    case 'hash':
      return processHash(index, state, argv);

    case 'package':
      return processPackage(index, state, argv);

    case 'push':
      return processPush(index, state, argv);

    case 'version':
      return processVersion(index, state, argv);

    default:
      return { nextState: state, nextIndex: ++index };
  }
}

const genModeHandler = (targetMode: TModes, prep: string) => (
  index: number,
  state: IModeOptions,
  argv: string[]
): INextIndexAndState => {
  const mode = argv[index];
  const fromEnvironment = argv[++index];
  const prepArg = argv[++index];
  const toEnvironment = argv[++index];

  expect(mode).to.equal(targetMode);
  expect(prepArg).to.equal(prep);

  const nextState: IModeOptions = mergeDeepRight(state, {
    mode,
    fromEnvironment,
    toEnvironment
  });
  const nextIndex = ++index;
  nextState.modeState[targetMode] = true;

  return { nextIndex, nextState };
};


const processVerify = genModeHandler('verify', 'to');

const processPackage = genModeHandler('package', 'to');

const processPush = genModeHandler('push', 'to');

function processHash(index: number, state: IModeOptions, argv: string[]): INextIndexAndState {
  const mode = argv[index];
  const fromEnvironment = argv[++index];

  expect(mode).to.equal('hash');

  const nextState = mergeDeepRight(state, {
    mode,
    fromEnvironment,
    modeState: {
      ...state.modeState,
      hash: true
    }
  });

  if (fromEnvironment === 'folder') {
    const folderPath = argv[++index];
    expect(folderPath).to.be.a('string');
    expect(folderPath).to.have.lengthOf.at.least(1);

    nextState.folder = folderPath;
  }

  const nextIndex = ++index;

  return { nextIndex, nextState };
}

function processVersion(index: number, state: IModeOptions, argv: string[]): INextIndexAndState {
  const mode = argv[index];

  expect(mode).to.equal('version');

  const nextState = mergeDeepRight(state, { mode });
  const nextIndex = ++index;

  return { nextIndex, nextState };
}

