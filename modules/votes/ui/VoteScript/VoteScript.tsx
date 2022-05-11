import { Text } from '@lidofinance/lido-ui'
import { useDecodedScript } from 'modules/votes/hooks/useDecodedScript'
import { Call } from './Call'
import { ScriptBox } from './styles'

type Props = {
  script: string
}

export function VoteScript({ script }: Props) {
  const { initialLoading, binary, decoded } = useDecodedScript(script)

  console.log(decoded)

  return (
    <div>
      <Text color="text" size="xs">
        Action Items
      </Text>
      {initialLoading || !decoded?.calls.length ? (
        <>
          <Text color="text" size="xxs">
            Binary script
          </Text>
          <ScriptBox value={binary} />
        </>
      ) : (
        <>
          {decoded.calls.map((call, i) => (
            <Call
              key={call.address + call.methodId + call.encodedCallData}
              id={i + 1}
              call={call}
            />
          ))}
        </>
      )}
    </div>
  )
}
