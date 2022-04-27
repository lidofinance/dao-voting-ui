import { Text } from '@lidofinance/lido-ui'
import { useDecodedScript } from 'modules/votes/hooks/useDecodedScript'
import { Call } from './Call'
import { ScriptBox } from './styles'

type Props = {
  script: string
}

export function VoteScript({ script }: Props) {
  const { initialLoading, binary, decoded } = useDecodedScript(script)

  return (
    <div>
      <Text color="text" size="xs">
        Action Items
      </Text>
      {initialLoading ? (
        <ScriptBox value={binary} />
      ) : (
        <>
          {decoded?.calls.map((call, i) => (
            <Call key={call.address + call.methodId} id={i + 1} call={call} />
          ))}
        </>
      )}
    </div>
  )
}
