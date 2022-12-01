import { Wrap, Footer } from '../DashboardVote/DashboardVoteStyle'
import { SkeletonBar } from 'modules/shared/ui/Skeletons/SkeletonBar'
import { SkeletonText } from 'modules/shared/ui/Skeletons/SkeletonText'

export function DashboardVoteSkeleton() {
  return (
    <Wrap>
      <SkeletonBar style={{ height: 40, marginBottom: 20 }} />
      <SkeletonText width={100} size={14} />
      <Footer>
        <SkeletonText width={60} size={12} style={{ marginBottom: 8 }} />
        <SkeletonBar style={{ height: 6, marginBottom: 8 }} />
        <SkeletonText width={90} size={12} />
      </Footer>
    </Wrap>
  )
}
