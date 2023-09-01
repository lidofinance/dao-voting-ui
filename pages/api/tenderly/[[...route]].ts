import isEmpty from 'lodash/isEmpty'
import clone from 'just-clone'
import getConfig from 'next/config'
import { tenderlyResponseTime } from 'modules/shared/metrics/responseTime'
import type { NextApiRequest, NextApiResponse } from 'next'

const { serverRuntimeConfig } = getConfig()
const { tenderlyUser, tenderlyProject, tendrerlyAccessKey } =
  serverRuntimeConfig

const getTenderlyApiUrl = (user: string, project: string) =>
  `https://api.tenderly.co/api/v1/account/${user}/project/${project}`

export default async function tenderly(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const requestInfo = {
    type: 'API request',
    path: 'tenderly',
    body: clone(req.body),
    query: clone(req.query),
    method: req.method,
    stage: 'INCOMING',
  }

  console.info('Incoming request to tenderly', requestInfo)

  try {
    const contentType = req.headers['content-type']
    const jsonMode = contentType === 'application/json'

    const route =
      typeof req.query.route === 'object'
        ? (req.query.route as string[]).join('/')
        : req.query.route

    const url =
      getTenderlyApiUrl(tenderlyUser, tenderlyProject) +
      (route ? `/${route}` : '')

    const end = tenderlyResponseTime.startTimer()
    const requested = await fetch(url, {
      method: req.method,
      ...(!isEmpty(req.body) ? { body: JSON.stringify(req.body) } : {}),
      headers: {
        'X-Access-Key': tendrerlyAccessKey,
        ...(jsonMode ? { 'Content-Type': 'application/json' } : {}),
      },
    })
    end()

    res.status(requested.status)

    if (jsonMode) {
      const responded = await requested.json()
      res.json(responded)
    } else {
      res.end()
    }

    console.info('Request to tenderly successfully fullfilled', {
      ...requestInfo,
      stage: 'FULFILLED',
    })
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : 'Something went wrong',
      error,
    )
    res.status(500).send({ error: 'Something went wrong!' })
  }

  res.end()
}
