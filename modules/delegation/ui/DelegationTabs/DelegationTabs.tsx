import { delegation, delegationDelegators } from 'modules/network/utils/urls'
import { Switch } from 'modules/delegation/ui/Switch'
import { NoSSRWrapper } from 'modules/shared/ui/Utils/NoSSRWrapper'
import { DelegationSettings } from '../DelegationSettings'
import { DelegatorsList } from '../DelegatorsList'
import { useIsDelegate } from 'modules/delegation/hooks/useIsDelegate'

const NAV_ROUTES = [
  { name: 'Delegate', path: delegation },
  { name: 'Check my delegators', path: delegationDelegators },
]

export type DelegationTabsLayoutProps = {
  mode: 'delegation' | 'delegators'
}

export const DelegationTabs = ({ mode }: DelegationTabsLayoutProps) => {
  const isDelegatorsMode = mode === 'delegators'

  const { data: isDelegate, initialLoading } = useIsDelegate()

  if (initialLoading) {
    return null
  }

  return (
    <>
      <NoSSRWrapper>
        {isDelegate && (
          <Switch checked={isDelegatorsMode} routes={NAV_ROUTES} />
        )}
        {isDelegatorsMode ? <DelegatorsList /> : <DelegationSettings />}
      </NoSSRWrapper>
    </>
  )
}
