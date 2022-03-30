import { registry } from 'modules/shared/metrics'

import { NextApiRequest, NextApiResponse } from 'next'

type Metrics = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

const metrics: Metrics = async (req, res) => {
  const collectedMetrics = await registry.metrics()
  res.send(collectedMetrics)
}

export default metrics
