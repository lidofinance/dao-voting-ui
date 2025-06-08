import { Text, Chip } from '@lidofinance/lido-ui'
import {
  ProposalDescription,
  ProposalListItemWrapper,
  StatusBadgeWrapper,
  SummarySection,
} from './DashboardDGProposalStyle'
import {
  ProposalCombinedData,
  ProposalStatus,
} from 'modules/dual-governance/types'

type Props = {
  id: number
  description: string
  proposalDetails: ProposalCombinedData['proposalDetails']
}

export const ProposalsListItem = ({
  id,
  description,
  proposalDetails,
}: Props) => {
  const { status } = proposalDetails

  return (
    <ProposalListItemWrapper>
      <SummarySection>
        <Text>Proposal #{id}</Text>
        <StatusBadgeWrapper>
          <Chip variant="gray">{ProposalStatus[status]}</Chip>
        </StatusBadgeWrapper>
      </SummarySection>
      <ProposalDescription>
        <Text size="xs">{description}</Text>
      </ProposalDescription>
    </ProposalListItemWrapper>
  )
}
