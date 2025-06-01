import { ArrowBack, Link, Text } from '@lidofinance/lido-ui'
import {
  DualGovernanceWarningBannerWrapper,
  LinkWrapper,
} from './DualGovernanceWarningBannerStyle'
import { getDualGovernanceLink } from 'modules/dual-governance/utils'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

export function DualGovernanceWarningBanner() {
  const { chainId } = useWeb3()

  return (
    <DualGovernanceWarningBannerWrapper>
      <Text size="xxs" strong>
        Governance is blocked
      </Text>
      <LinkWrapper>
        <Link href={getDualGovernanceLink(chainId)} target="_blank">
          <Text size="xxs">See details</Text>
        </Link>

        <ArrowBack height="14px" />
      </LinkWrapper>
    </DualGovernanceWarningBannerWrapper>
  )
}
