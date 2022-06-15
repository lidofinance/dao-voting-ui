import { useDecodedScript } from 'modules/votes/hooks/useDecodedScript'

import { Text } from '@lidofinance/lido-ui'
import { VoteScriptBody } from './VoteScriptBody'

type Props = {
  script: string
}

export function VoteScript({ script }: Props) {
  const { initialLoading, binary, decoded } = useDecodedScript(script)

  return (
    <>
      <Text color="text" size="xs">
        Action Items
      </Text>
      <VoteScriptBody
        binary={binary}
        decoded={decoded}
        initialLoading={initialLoading}
      />
    </>
  )
}
