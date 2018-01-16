const { version } = require('../../package.json')
const { yellow } = require('chalk')
import { APP_NAME } from '../../configs'
import { logger } from '../../lib'

export function* versionMode() {
  logger.succeed(`${yellow(APP_NAME)} is on version ${yellow(version)}`)
}
