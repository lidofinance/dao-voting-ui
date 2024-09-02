import { useState } from 'react'
import { Button, Text, useBreakpoint } from '@lidofinance/lido-ui'

import { FormTitle, FormWrap, Wrap } from './DelegationSettingsStyle'
import { DelegationForm } from '../DelegationForm'
import { PublicDelegateList } from '../PublicDelegateList'
import { DelegateFromPublicListProvider } from '../../providers/DelegateFromPublicListContext'

export function DelegationSettings() {
  const [isSimpleModeOn, setIsSimpleModeOn] = useState(true)
  const isMobile = useBreakpoint('md')

  return (
    <Wrap>
      <DelegateFromPublicListProvider>
        <FormWrap $customizable={!isSimpleModeOn}>
          <FormTitle>
            <Text size={isMobile ? 'lg' : 'xl'} weight={700}>
              Delegation
            </Text>
            {!isSimpleModeOn && (
              <Button
                variant="outlined"
                size="xs"
                onClick={() => setIsSimpleModeOn(true)}
              >
                Back
              </Button>
            )}
          </FormTitle>
          {isSimpleModeOn ? (
            <DelegationForm
              mode="simple"
              onCustomizeClick={() => setIsSimpleModeOn(false)}
            />
          ) : (
            <>
              <DelegationForm mode="aragon" />
              <DelegationForm mode="snapshot" />
            </>
          )}
        </FormWrap>
        <PublicDelegateList />
      </DelegateFromPublicListProvider>
    </Wrap>
  )
}
