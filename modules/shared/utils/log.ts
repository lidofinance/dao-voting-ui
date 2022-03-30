import { createLogger, transports, format } from 'winston'
// @ts-ignore
import { traverse } from 'object-traversal'
import { sanitizeMessage } from './sanitize'

const { json, timestamp, combine, errors } = format

const sanitize = format(info => {
  traverse(info, context => {
    const { parent, key, value } = context
    if (parent && key && typeof value === 'string') {
      parent[key] = sanitizeMessage(value)
    }
  })
  return info
})

const jsonLogger = createLogger({
  defaultMeta: {
    service: 'dao-voting-ui',
  },
  format: combine(timestamp(), errors({ stack: true }), sanitize(), json()),
  transports: [new transports.Console()],
})

export const logger =
  process.env.NODE_ENV === 'production' ? jsonLogger : console
