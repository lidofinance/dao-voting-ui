import { useConnect } from 'reef-knot/core-react'

import { Button } from '@lidofinance/lido-ui'

export function VoteFormMustConnect() {
  const { connect } = useConnect()

  return (
    <Button fullwidth onClick={connect}>
      Connect wallet
    </Button>
  )
}
