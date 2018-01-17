import * as R from 'ramda'
const { mergeDeepRight, clone } = R

import { IOptions } from './types'
import { defaultOptions } from './default'
import { parseArgAndSetState } from './parsers'
import { validateOptionsState } from './validators'

export const options = ((): IOptions => {
  let state: IOptions = { ...defaultOptions }
  let index = 2 //skip first two arguments
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
