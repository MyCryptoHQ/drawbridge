import * as R from 'ramda'
const { mergeDeepRight } = R

import { IOptions } from './types'
import { defaultOptions } from './default'
import { parseArgAndSetState } from './parsers'
import { validateOptionsState } from './validators'
import {setEnvironmentDefaults} from '../constants'

require('rc')('drawbridge', defaultOptions)

export const options = ((): IOptions => {
    setEnvironmentDefaults(defaultOptions.environments)
  let state: IOptions = { ...defaultOptions }
  // skip first two arguments
  let index = 2
  const { argv } = process

  while (argv[index]) {
    const { nextIndex, nextState } = parseArgAndSetState(index, state, argv)
    index = nextIndex
    state = nextState
  }

  const stateCopy = mergeDeepRight(state, {})
  validateOptionsState(stateCopy)
  return state
})()

export const getOptions = () => options
