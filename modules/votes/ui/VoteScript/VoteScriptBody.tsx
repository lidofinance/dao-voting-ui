import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { Link } from '@lidofinance/lido-ui'
import {
  CallTitle,
  CallWrapper,
  ScriptBox,
  NestedPadding,
} from './VoteScriptStyle'

import { EVMScriptDecoded } from '@lidofinance/evm-script-decoder/lib/types'
import { getEtherscanAddressLink } from '@lido-sdk/helpers'
import { getContractName } from 'modules/config/utils/getContractName'
import { formatCallString } from './utils'

type Props = {
  binary: string
  decoded?: EVMScriptDecoded
  parentId?: string | number
}

export function VoteScriptBody({ binary, decoded, parentId }: Props) {
  const { chainId } = useWeb3()

  if (!decoded?.calls.length) {
    return (
      <CallWrapper>
        <ScriptBox>{binary}</ScriptBox>
      </CallWrapper>
    )
  }

  return (
    <>
      {decoded.calls.map((call, i) => {
        const id = i + 1
        const { address, abi, encodedCallData, decodedCallData } = call
        const callString = formatCallString(id, abi, decodedCallData)
        const nestedScriptsIdxs = abi?.inputs?.reduce(
          (r, c, j) => (c.name === '_evmScript' ? [...r, j] : r),
          [],
        )
        const showNestedScripts =
          nestedScriptsIdxs && nestedScriptsIdxs.length > 0
        const contractNameListed = getContractName(chainId, address)

        return (
          <CallWrapper key={i}>
            <CallTitle size="xxs">
              {parentId !== undefined ? `${parentId}.${id}` : id}. On{' '}
              {contractNameListed && (
                <>
                  [{contractNameListed}]
                  <br />
                </>
              )}
              <Link href={getEtherscanAddressLink(chainId, address)}>
                {address}
              </Link>
            </CallTitle>

            <ScriptBox>{callString}</ScriptBox>

            {showNestedScripts && (
              <NestedPadding>
                {nestedScriptsIdxs.map(idx => (
                  <VoteScriptBody
                    key={idx}
                    binary={encodedCallData}
                    decoded={decodedCallData?.[idx]}
                    parentId={id}
                  />
                ))}
              </NestedPadding>
            )}
          </CallWrapper>
        )
      })}
    </>
  )
}
