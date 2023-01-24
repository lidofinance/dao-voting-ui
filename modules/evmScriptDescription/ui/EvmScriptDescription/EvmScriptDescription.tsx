import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useDecodedScript } from 'modules/votes/hooks/useDecodedScript'

import {
  DescriptionWrap,
  DescriptionItemsList,
} from './EvmScriptDescriptionStyle'

import { CHAINS } from '@lido-sdk/constants'
import { replaceAddressWithBadges } from 'modules/shared/utils/replaceAddressWithBadges'
import type { EVMScriptDecoded } from '@lidofinance/evm-script-decoder/lib/types'
import type { Vote } from 'modules/votes/types'
import {
  describeScript,
  EVMScriptDescription,
} from 'modules/evmScriptDescription/utils/describeScript'

const EMPTY_DESCRIPTION_TEXT =
  'No description has been provided for this proposal.'

type DescriptionItemsProps = {
  items: EVMScriptDescription[]
  steps?: number[]
}

function DescriptionItems({ items, steps = [] }: DescriptionItemsProps) {
  const topStepsFormatted = steps.length > 0 ? `${steps.join('.')}.` : ''

  return (
    <DescriptionItemsList indentLevel={steps.length}>
      {items.map(({ contractName, evaluatedDescription, children }, i) => (
        <div key={`${steps}.${i}`}>
          {`${topStepsFormatted}${i + 1}. `}

          {contractName ? (
            <>
              {contractName}:{' '}
              {evaluatedDescription
                ? replaceAddressWithBadges(evaluatedDescription)
                : EMPTY_DESCRIPTION_TEXT}
            </>
          ) : (
            EMPTY_DESCRIPTION_TEXT
          )}

          {children && children.length > 0 && (
            <DescriptionItems items={children} steps={[...steps, i + 1]} />
          )}
        </div>
      ))}
    </DescriptionItemsList>
  )
}

type Props = {
  vote: Vote
  metadata?: string
}

export function EvmScriptDescription({ vote, metadata }: Props) {
  const { chainId } = useWeb3()
  const { decoded } = useDecodedScript(vote.script)

  const { data: descriptions } = useSWR(
    decoded ? [`script-description`, decoded, chainId] : null,
    async (_, _decoded: EVMScriptDecoded, _chainId: CHAINS) => {
      const described = await describeScript(_decoded, _chainId)
      return described
    },
  )

  return (
    <DescriptionWrap>
      {metadata && <div>{metadata && replaceAddressWithBadges(metadata)}</div>}
      {metadata && descriptions && descriptions.length > 0 && (
        <>
          <br />
        </>
      )}
      {descriptions && <DescriptionItems items={descriptions} />}
    </DescriptionWrap>
  )
}
