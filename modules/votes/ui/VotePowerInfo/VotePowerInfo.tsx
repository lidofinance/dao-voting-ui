import { Text } from '@lidofinance/lido-ui'
import { InfoWrap, VotingPower, Amount } from './VotePowerInfoStyle'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'
import { useDelegators } from 'modules/delegation/hooks/useDelegators'
import { BigNumber } from 'ethers'

interface Props {
  votePowerWei: BigNumber | null | undefined
}

export function VotePowerInfo({ votePowerWei }: Props) {
  const { data: govSymbol } = useGovernanceSymbol()
  const {
    data: { nonZeroDelegators, totalVotingPower },
  } = useDelegators()

  return (
    <InfoWrap>
      <VotingPower>
        <Text as="span" color="secondary" size="xxs">
          My voting power
        </Text>
        <Amount data-testid="myVPAmount">
          {formatBalance(votePowerWei || BigNumber.from(0))} {govSymbol}
        </Amount>
      </VotingPower>
      {nonZeroDelegators.length > 0 && (
        <VotingPower>
          <Text as="span" color="secondary" size="xxs">
            Delegated voting power
          </Text>
          <Amount data-testid="delegatedVPAmount">
            {formatBalance(totalVotingPower)} {govSymbol}
          </Amount>
        </VotingPower>
      )}
    </InfoWrap>
  )
}
