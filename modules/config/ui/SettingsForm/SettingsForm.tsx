import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { Title } from 'modules/shared/ui/Common/Title'
import { Fieldset } from 'modules/shared/ui/Common/Fieldset'
import { Form } from 'modules/shared/ui/Controls/Form'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import {
  CheckboxControl,
  CheckboxLabelWrap,
} from 'modules/shared/ui/Controls/Checkbox'
import { Container, Block, Button } from '@lidofinance/lido-ui'

type FormValues = {
  rpcUrl: string
  etherscanApiKey: string
  useBundledAbi: boolean
}

export function SettingsForm() {
  const { savedConfig, setSavedConfig } = useConfig()
  const { chainId } = useWeb3()

  const formMethods = useForm<FormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      rpcUrl: savedConfig.rpcUrls[chainId] || '',
      etherscanApiKey: savedConfig.etherscanApiKey,
      useBundledAbi: savedConfig.useBundledAbi,
    },
  })

  const handleSubmit = useCallback(
    (formValues: FormValues) => {
      setSavedConfig({
        rpcUrls: {
          [chainId]: formValues.rpcUrl,
        },
        etherscanApiKey: formValues.etherscanApiKey,
        useBundledAbi: formValues.useBundledAbi,
      })
    },
    [chainId, setSavedConfig],
  )

  return (
    <Container as="main" size="tight">
      <Title title="Settings" />
      <Block>
        <Form formMethods={formMethods} onSubmit={handleSubmit}>
          <Fieldset>
            <InputControl
              label="RPC Url (infura / alchemy / custom)"
              name="rpcUrl"
            />
          </Fieldset>
          <Fieldset>
            <InputControl label="Etherscan api key" name="etherscanApiKey" />
          </Fieldset>
          <Fieldset>
            <CheckboxLabelWrap>
              <CheckboxControl name="useBundledAbi" />
              Use bundled abi first
            </CheckboxLabelWrap>
          </Fieldset>
          <Button type="submit" fullwidth color="primary" children="Save" />
        </Form>
      </Block>
    </Container>
  )
}
