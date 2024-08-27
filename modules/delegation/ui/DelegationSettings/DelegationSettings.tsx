import { useCallback, useState } from 'react'
import { Button, Text } from '@lidofinance/lido-ui'

import { FormTitle, FormWrap, Wrap } from './DelegationSettingsStyle'
import { DelegationForm } from '../DelegationForm'
import { PublicDelegateList } from '../PublicDelegateList'

export function DelegationSettings() {
  const [isSimpleModeOn, setIsSimpleModeOn] = useState(true)
  const [delegateFromPublicList, setDelegateFromPublicList] = useState<string>()

  const handleDelegatePick = useCallback(
    (address: string) => () => {
      setDelegateFromPublicList(address)
    },
    [],
  )

  return (
    <Wrap>
      <FormWrap $customizable={!isSimpleModeOn}>
        <FormTitle>
          <Text size="xl" weight={700}>
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
            presetDelegateAddress={delegateFromPublicList}
            onCustomizeClick={() => setIsSimpleModeOn(false)}
          />
        ) : (
          <>
            <DelegationForm
              mode="aragon"
              presetDelegateAddress={delegateFromPublicList}
            />
            <DelegationForm
              mode="snapshot"
              presetDelegateAddress={delegateFromPublicList}
            />
          </>
        )}
      </FormWrap>
      <PublicDelegateList onDelegatePick={handleDelegatePick} />
    </Wrap>
  )
}
