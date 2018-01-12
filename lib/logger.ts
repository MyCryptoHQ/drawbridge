
import { options, SESSION_LOG_FILE, TESTING } from '../configs'
import * as ora from 'ora'
import * as fse from 'fs-extra'

const { red, yellow, green } = require('chalk');

let LOG_FILE_BUFFER = [];


export const printWelcomeMessage = () =>
  console.log(
    `  Writing trace log to ${yellow(SESSION_LOG_FILE)}\n\n`,
    ` Run ${yellow(`tail -f ${SESSION_LOG_FILE}`)} in a seperate terminal to view the trace in real time\n`
  )

export const logger = (() => {
  const spinner = ora()
  let currentText = ''

  const log = (msg: string) => {  
    file(msg)
    spinner.start(msg)
    currentText = msg
  }

  const debug = (msg: string) => {
    file(msg)
    if (options.logLevel !== 'debug') {
      return
    }
    spinner.info(msg)
    spinner.start(currentText)
  }

  const succeed = (msg?: string) => {
    file(msg)
    spinner.succeed(msg)
  }

  const fail = (msg: string) => {
    file(msg)
    spinner.fail(red(msg))
  }

  const file = (msg: string) => {
    LOG_FILE_BUFFER.push(`${green('>>>>')} ${msg}\n`)
  }

  const child = (msg: string) =>
    LOG_FILE_BUFFER.push(msg)

  return { log, debug, succeed, fail, file, child }
})()

const writeLogFile = async () => {
  const buffer = LOG_FILE_BUFFER
  LOG_FILE_BUFFER = []

  try {
    await fse.appendFile(
      SESSION_LOG_FILE,
      buffer.join('')
    )
  } catch (err) {
    console.error(err)
  }
}

let logWriteInterval
export const startLogWriteInterval = () => logWriteInterval = setInterval(writeLogFile, 100)
export const clearLogWriteInterval = () => setTimeout(() => clearInterval(logWriteInterval), 300)

