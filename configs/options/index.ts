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

  return validateOptionsState(state)
})()

export const getOptions = () => options
