import { delegation, delegationDelegators } from 'modules/network/utils/urls'
import { Switch } from 'modules/delegation/ui/Switch'
import { NoSSRWrapper } from 'modules/shared/ui/Utils/NoSSRWrapper'
import { DelegationSettings } from '../DelegationSettings'
import { DelegatorsList } from '../DelegatorsList'

const NAV_ROUTES = [
  { name: 'Delegate', path: delegation },
  { name: 'Check my delegators', path: delegationDelegators },
]

export type DelegationTabsLayoutProps = {
  mode: 'delegation' | 'delegators'
}

export const DelegationTabs = ({ mode }: DelegationTabsLayoutProps) => {
  const isDelegatorsMode = mode === 'delegators'

  return (
    <>
      <NoSSRWrapper>
        <Switch checked={isDelegatorsMode} routes={NAV_ROUTES} />
        {isDelegatorsMode ? <DelegatorsList /> : <DelegationSettings />}
      </NoSSRWrapper>
    </>
  )
}
