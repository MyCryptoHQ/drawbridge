import * as path from 'path';

import * as R from 'ramda';
const { mergeDeepRight } = R;

import { TOptions, TModeAndRcOptions, IModeOptions, IRcOptions, IEnvironmentConfigs } from './types';
import { defaultRcOptions, defaultModeOptions } from './default';
import { parseArgAndSetState } from './parsers';
import { validateModeOptions, validateRcOptions, validateAppOptions } from './validators';
import { SESSION_FOLDER, DOCKERFILE_FOLDER } from '../constants';
import { criticalFailure } from '../../lib';
import { normalizeAndMergeOptions } from './normalize';


const rcOptions: IRcOptions = { ...defaultRcOptions };
require('rc')('drawbridge', rcOptions);

const appOptions: TOptions = ((): TOptions => {
  try {
    let modeOptions: IModeOptions = { ...defaultModeOptions };

    // skip first two arguments
    let index = 2;
    const { argv } = process;

    while (argv[index]) {
      const { nextIndex, nextState } = parseArgAndSetState(index, modeOptions, argv);
      index = nextIndex;
      modeOptions = nextState;
    }

    const stateCopy = mergeDeepRight(modeOptions, {});
    validateModeOptions(stateCopy);

    const rcCopy = mergeDeepRight(rcOptions, {});
    validateRcOptions(rcCopy);

    const mergedOptions = normalizeAndMergeOptions(
      modeOptions,
      rcOptions
    );
    const mergedOptionsCopy = mergeDeepRight(mergedOptions, {});
    validateAppOptions(mergedOptionsCopy);

    return mergedOptions;
  } catch (err) {
    criticalFailure(err);
  }
})();

export const getOptions = () => appOptions;
export const getEnvConfig = (env: string) => appOptions.environments[env];
