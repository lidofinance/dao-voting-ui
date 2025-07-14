import { ArrowBack, Link, Text } from '@lidofinance/lido-ui'
import { DualGovernanceWarningBannerWrapper } from './DualGovernanceWarningBannerStyle'
import { getDualGovernanceLink } from 'modules/dual-governance/utils'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

export function DualGovernanceWarningBanner() {
  const { chainId } = useWeb3()

  return (
    <Link href={getDualGovernanceLink(chainId)} target="_blank">
      <DualGovernanceWarningBannerWrapper>
        <Text size="xxs" strong>
          Governance is blocked
        </Text>
        <Text size="xxs">See details</Text>
        <ArrowBack height="14px" />
      </DualGovernanceWarningBannerWrapper>
    </Link>
  )
}
