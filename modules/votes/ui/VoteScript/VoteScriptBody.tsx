import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { Link, Text } from '@lidofinance/lido-ui'
import {
  CallTitle,
  CallWrapper,
  ScriptBox,
  NestedPadding,
  DGBadge,
} from './VoteScriptStyle'

import { EVMScriptDecoded } from '@lidofinance/evm-script-decoder/lib/types'
import { getEtherscanAddressLink } from 'modules/blockChain/utils/etherscan'
import { getContractName } from 'modules/config/utils/getContractName'
import { formatCallString } from './utils'
import { useGetContractAddress } from 'modules/blockChain/hooks/useGetContractAddress'
import { DGIcon } from 'modules/dual-governance/DGIcon'

type Props = {
  binary: string
  decoded?: EVMScriptDecoded
  parentId?: string | number
}

export function VoteScriptBody({ binary, decoded, parentId }: Props) {
  const { chainId } = useWeb3()
  const getContractAddress = useGetContractAddress()

  if (!decoded?.calls) {
    return (
      <CallWrapper>
        <ScriptBox>{binary}</ScriptBox>
      </CallWrapper>
    )
  }

  const dualGovernanceAddress =
    getContractAddress('DualGovernance').toLowerCase()

  const legacyDualGovernanceAddress = getContractAddress(
    'DualGovernanceLegacy',
  ).toLowerCase()

  return (
    <>
      {decoded.calls.map((call, i) => {
        const id = i + 1
        const { address, abi, encodedCallData, decodedCallData } = call
        const callString = formatCallString(chainId, id, abi, decodedCallData)
        const nestedScriptsIdxs = abi?.inputs?.reduce(
          (r, c, j) =>
            c.name === '_evmScript' || c.name === 'calls' ? [...r, j] : r,
          [],
        )
        const showNestedScripts =
          nestedScriptsIdxs && nestedScriptsIdxs.length > 0
        const contractNameListed = getContractName(chainId, address)

        const withDg =
          call.abi?.name === 'submitProposal' &&
          (call.address.toLowerCase() === dualGovernanceAddress ||
            call.address.toLowerCase() === legacyDualGovernanceAddress)

        return (
          <CallWrapper key={i} $withDg={withDg}>
            {withDg && (
              <DGBadge>
                {DGIcon}{' '}
                <Text weight={700} size="xxs" color="primary">
                  Under Dual Governance
                </Text>
              </DGBadge>
            )}
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
