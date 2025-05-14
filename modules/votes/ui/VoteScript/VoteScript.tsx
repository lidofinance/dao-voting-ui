import { useState, useMemo } from 'react'
import { useSWR } from 'modules/network/hooks/useSwr'
import { Loader } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  Tabs,
  Tab,
  VoteScriptBodyWrap,
  ScriptLoaderWrap,
} from './VoteScriptStyle'
import { VoteScriptBody } from './VoteScriptBody'
import { useCalldataDecoder } from 'modules/blockChain/hooks/useCalldataDecoder'
import {
  EVMScriptCall,
  EVMScriptDecoded,
} from '@lidofinance/evm-script-decoder/lib/types'
import { CalldataDecoder } from 'modules/blockChain/CalldataDecoder'
import { EVMScriptDecoder } from '@lidofinance/evm-script-decoder'
import { useEVMScriptDecoder } from 'modules/votes/hooks/useEvmScriptDecoder'
import { CHAINS } from '@lido-sdk/constants'
import { useGetContractAddress } from 'modules/blockChain/hooks/useGetContractAddress'

type Props = {
  script: string
  metadata?: string
}

const parseDGCalls = async (
  decoded: EVMScriptDecoded | undefined,
  calldataDecoder: CalldataDecoder,
  evmScriptDecoder: EVMScriptDecoder,
  dualGovernanceAddress: string,
): Promise<EVMScriptDecoded | undefined> => {
  if (!decoded?.calls.length) {
    return decoded
  }

  const parsedCalls: EVMScriptCall[] = []

  for (const call of decoded.calls) {
    const hasDg =
      call.abi?.name === 'submitProposal' &&
      call.address.toLowerCase() === dualGovernanceAddress.toLowerCase()
    if (!hasDg) {
      parsedCalls.push(call)
    } else {
      const parsedDgDecodedCalldata: EVMScriptDecoded[] = []
      const internalCalls: EVMScriptCall[] = []

      for (const data of call.decodedCallData ?? []) {
        if (!Array.isArray(data) || !Array.isArray(data[0])) {
          parsedDgDecodedCalldata.push(data)
        } else {
          for (const item of data) {
            const [to, , payload] = item

            if (payload && to) {
              const decodedCallData = await calldataDecoder.decodeWithAddress(
                to,
                payload,
              )

              if (
                decodedCallData &&
                typeof decodedCallData.params['_evmScript'] === 'string'
              ) {
                const decodedEvmScript = await evmScriptDecoder.decodeEVMScript(
                  decodedCallData.params['_evmScript'],
                )
                internalCalls.push(...decodedEvmScript.calls)
              } else {
                // format like evm script call
                const formattedCall: EVMScriptCall = {
                  methodId: '',
                  callDataLength: 0,
                  address: to,
                  abi: decodedCallData?.abi,
                  encodedCallData: payload,
                  decodedCallData: decodedCallData
                    ? Object.keys(decodedCallData.params)
                        .map(key => {
                          if (!isNaN(Number(key))) {
                            return decodedCallData.params[key]
                          }
                        })
                        .filter(Boolean)
                    : undefined,
                }
                internalCalls.push(formattedCall)
              }
            }
          }
          // compress the internal calls
          if (internalCalls.length) {
            parsedDgDecodedCalldata.push({
              specId: '0x00000001',
              calls: internalCalls,
            })
          }
        }
      }
      parsedCalls.push({
        ...call,
        decodedCallData: parsedDgDecodedCalldata,
      })
    }
  }

  return {
    ...decoded,
    calls: parsedCalls,
  }
}

export function VoteScript({ script, metadata = '' }: Props) {
  const [activeTab, setActiveTab] = useState(0)
  const calldataDecoder = useCalldataDecoder()
  const evmScriptDecoder = useEVMScriptDecoder()
  const { chainId } = useWeb3()
  const getContractAddress = useGetContractAddress()

  const { data: decoded, initialLoading } = useSWR(
    ['swr:decode-script', chainId, evmScriptDecoder, calldataDecoder, script],
    async (
      _key: string,
      _chainId: CHAINS,
      _evmDecoder: EVMScriptDecoder,
      _callDataDecoder: CalldataDecoder,
      _script: string,
    ) => {
      const decodedEvmScript = await _evmDecoder.decodeEVMScript(_script)
      const dualGovernanceAddress = getContractAddress('DualGovernance')
      const parsedScriptForDg = await parseDGCalls(
        decodedEvmScript,
        _callDataDecoder,
        _evmDecoder,
        dualGovernanceAddress,
      )
      return parsedScriptForDg
    },
  )

  const tabs = useMemo(() => {
    const tabMap = {
      Parsed: !initialLoading && decoded?.calls.length,
      JSON: !initialLoading && decoded?.calls.length,
      Raw: true,
      Items: Boolean(metadata),
    }
    const TabNames = Object.keys(tabMap) as (keyof typeof tabMap)[]
    return TabNames.filter(key => tabMap[key])
  }, [decoded?.calls.length, initialLoading, metadata])

  return (
    <>
      <Tabs>
        {tabs.map((tab, i) => (
          <Tab
            key={tab}
            isActive={activeTab === i}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </Tab>
        ))}
      </Tabs>
      <VoteScriptBodyWrap>
        {initialLoading && (
          <ScriptLoaderWrap>
            <Loader size="medium" />
          </ScriptLoaderWrap>
        )}

        {tabs[activeTab] === 'Raw' && <VoteScriptBody binary={script} />}

        {tabs[activeTab] === 'JSON' && (
          <VoteScriptBody binary={JSON.stringify(decoded, null, 2)} />
        )}

        {tabs[activeTab] === 'Parsed' && (
          <VoteScriptBody binary={script} decoded={decoded} />
        )}
        {tabs[activeTab] === 'Items' && <VoteScriptBody binary={metadata} />}
      </VoteScriptBodyWrap>
    </>
  )
}
