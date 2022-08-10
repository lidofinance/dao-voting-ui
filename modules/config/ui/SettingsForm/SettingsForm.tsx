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
import { Container, Block, Button, ToastSuccess } from '@lidofinance/lido-ui'
import { Actions } from './StyledFormStyle'

import { ContractVoting } from 'modules/blockChain/contracts'
import { fetcherEtherscan } from 'modules/network/utils/fetcherEtherscan'
import { isUrl } from 'modules/shared/utils/isUrl'

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
      etherscanApiKey: savedConfig.etherscanApiKey || '',
      useBundledAbi: savedConfig.useBundledAbi,
    },
  })

  const { formState, setValue, getValues } = formMethods

  const handleSubmit = useCallback(
    (formValues: FormValues) => {
      setSavedConfig({
        rpcUrls: {
          [chainId]: formValues.rpcUrl,
        },
        etherscanApiKey: formValues.etherscanApiKey,
        useBundledAbi: formValues.useBundledAbi,
      })
      ToastSuccess('Settings have been saved')
    },
    [chainId, setSavedConfig],
  )

  const validateRpcUrl = useCallback(
    async (rpcUrl: string) => {
      if (!rpcUrl) return true
      if (!isUrl(rpcUrl)) return 'Given string is not valid url'
      try {
        // Doing a random request to check rpc url is fetchable
        const voting = ContractVoting.connectRpc({ chainId, rpcUrl })
        await voting.voteTime()
        return true
      } catch (err) {
        return 'Given url is not working'
      }
    },
    [chainId],
  )

  const validateEtherscanKey = useCallback(
    async (etherscanApiKey: string) => {
      if (!etherscanApiKey) return true
      const errMsg = 'Etherscan api can not be accessed with given key now'
      try {
        // Doing a random request to check etherscan key is viable
        const address = ContractVoting.address[chainId] as string
        const res = await fetcherEtherscan<string>({
          chainId,
          address,
          module: 'contract',
          action: 'getabi',
          apiKey: etherscanApiKey,
        })
        if (res === 'Invalid API Key') return errMsg
        return true
      } catch (err) {
        return errMsg
      }
    },
    [chainId],
  )

  const handleReset = useCallback(() => {
    setValue('rpcUrl', '')
    setValue('etherscanApiKey', '')
    setValue('useBundledAbi', true)
    handleSubmit(getValues())
  }, [setValue, getValues, handleSubmit])

  return (
    <Container as="main" size="tight">
      <Title title="Settings" />
      <Block>
        <Form formMethods={formMethods} onSubmit={handleSubmit}>
          <Fieldset>
            <InputControl
              label="RPC Url (infura / alchemy / custom)"
              name="rpcUrl"
              rules={{ validate: validateRpcUrl }}
            />
          </Fieldset>
          <Fieldset>
            <InputControl
              label="Etherscan api key"
              name="etherscanApiKey"
              rules={{ validate: validateEtherscanKey }}
            />
          </Fieldset>
          <Fieldset>
            <CheckboxLabelWrap>
              <CheckboxControl name="useBundledAbi" />
              Use bundled abi first
            </CheckboxLabelWrap>
          </Fieldset>
          <Actions>
            <Button
              fullwidth
              variant="translucent"
              children="Reset to defaults"
              onClick={handleReset}
            />
            <Button
              type="submit"
              fullwidth
              color="primary"
              children="Save"
              loading={formState.isValidating}
              disabled={!formState.isValid || formState.isValidating}
            />
          </Actions>
        </Form>
      </Block>

      <br />

      <Block>
        Ethereum nodes for use:
        <br />
        <a target="_blank" href="https://ethereumnodes.com/" rel="noreferrer">
          https://ethereumnodes.com/
        </a>
        <br />
        <br />
        Etherscan api key:
        <br />
        <a
          target="_blank"
          href="https://etherscan.io/myapikey"
          rel="noreferrer"
        >
          https://etherscan.io/myapikey
        </a>
      </Block>
    </Container>
  )
}
