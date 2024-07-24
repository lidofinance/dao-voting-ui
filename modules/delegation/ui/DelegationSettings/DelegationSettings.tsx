import { useState } from 'react'

import { FormTitle, Wrap } from './DelegationSettingsStyle'
import { DelegationForm } from '../DelegationForm'
import { Button, Text } from '@lidofinance/lido-ui'

export function DelegationSettings() {
  const [isSimpleModeOn, setIsSimpleModeOn] = useState(true)

  return (
    <Wrap $customizable={!isSimpleModeOn}>
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
          onCustomizeClick={() => setIsSimpleModeOn(false)}
        />
      ) : (
        <>
          <DelegationForm mode="aragon" />
          <DelegationForm mode="snapshot" />
        </>
      )}
    </Wrap>
  )
}
