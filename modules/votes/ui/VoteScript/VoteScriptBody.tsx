import { Fragment } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { Text, Link, Loader } from '@lidofinance/lido-ui'
import { CallTitle, CallWrapper, ScriptBox, Padding } from './styles'
import { ScriptWrap, ScriptLoaderWrap } from './VoteScriptBodyStyle'

import { EVMScriptDecoded } from 'evm-script-decoder/lib/types'
import { getEtherscanAddressLink } from '@lido-sdk/helpers'
import { formatCallString } from './utils'

type Props = {
  binary: string
  decoded?: EVMScriptDecoded
  initialLoading?: boolean
  parentId?: string | number
}

export function VoteScriptBody({
  binary,
  decoded,
  initialLoading,
  parentId,
}: Props) {
  const { chainId } = useWeb3()

  if (initialLoading || !decoded?.calls.length) {
    return (
      <ScriptWrap>
        {initialLoading && (
          <ScriptLoaderWrap>
            <Loader size="medium" />
          </ScriptLoaderWrap>
        )}
        <Text color="text" size="xxs">
          Binary script
        </Text>
        <ScriptBox value={binary} />
      </ScriptWrap>
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

        return (
          <Fragment key={i}>
            <CallWrapper>
              <CallTitle color="text" size="xxs">
                {parentId !== undefined ? `${parentId}.${id}` : id}. On{' '}
                <Link href={getEtherscanAddressLink(chainId, address)}>
                  {address}
                </Link>
              </CallTitle>
              <ScriptBox value={callString} />
            </CallWrapper>

            {showNestedScripts && (
              <Padding>
                {nestedScriptsIdxs.map(idx => (
                  <VoteScriptBody
                    key={idx}
                    binary={encodedCallData}
                    decoded={decodedCallData?.[idx]}
                    parentId={id}
                  />
                ))}
              </Padding>
            )}
          </Fragment>
        )
      })}
    </>
  )
}
