import { logger } from 'modules/shared/utils/log'
import { NextApiRequest, NextApiResponse } from 'next'

export default function cspReport(req: NextApiRequest, res: NextApiResponse) {
  logger.warn({
    message: 'CSP Violation',
    report: JSON.parse(req.body),
  })

  res.status(200).send({ status: 'ok' })
}
