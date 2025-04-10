import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { Card } from 'modules/shared/ui/Common/Card'
import { Fieldset } from 'modules/shared/ui/Common/Fieldset'
import { Form } from 'modules/shared/ui/Controls/Form'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import {
  CheckboxControl,
  CheckboxLabelWrap,
} from 'modules/shared/ui/Controls/Checkbox'
import { Button, Container, ToastSuccess } from '@lidofinance/lido-ui'
import { Actions, DescriptionText, DescriptionTitle } from './StyledFormStyle'
import { ethers } from 'ethers'
import { getChainName } from 'modules/blockChain/chains'
import { fetcherEtherscan } from 'modules/network/utils/fetcherEtherscan'
import { isUrl } from 'modules/shared/utils/isUrl'
import { useContractHelpers } from 'modules/blockChain/hooks/useContractHelpers'
import { isTestnet as getIsTestnet } from 'modules/blockChain/utils/isTestnet'

type FormValues = {
  rpcUrl: string
  etherscanApiKey: string
  useBundledAbi: boolean
  useTestContracts: boolean
}

export function SettingsForm() {
  const { savedConfig, setSavedConfig } = useConfig()
  const { chainId } = useWeb3()
  const { ldoHelpers } = useContractHelpers()

  const formMethods = useForm<FormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      rpcUrl: savedConfig.rpcUrls[chainId] || '',
      etherscanApiKey: savedConfig.etherscanApiKey || '',
      useBundledAbi: savedConfig.useBundledAbi,
      useTestContracts: savedConfig.useTestContracts,
    },
  })

  const { formState, setValue, getValues } = formMethods

  const saveSettings = useCallback(
    (formValues: FormValues) => {
      setSavedConfig({
        rpcUrls: {
          [chainId]: formValues.rpcUrl,
        },
        etherscanApiKey: formValues.etherscanApiKey,
        useBundledAbi: formValues.useBundledAbi,
        useTestContracts: formValues.useTestContracts,
      })
    },
    [chainId, setSavedConfig],
  )

  const handleSubmit = useCallback(
    (formValues: FormValues) => {
      saveSettings(formValues)
      ToastSuccess('Settings have been saved')
    },
    [saveSettings],
  )

  const validateRpcUrl = useCallback(
    async (rpcUrl: string) => {
      if (!rpcUrl) return true
      if (!isUrl(rpcUrl)) return 'Given string is not valid url'
      try {
        // Check chain id
        const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl)
        const network = await rpcProvider.getNetwork()
        if (network.chainId !== chainId) {
          return `Url is working, but network does not match to ${getChainName(
            chainId!,
          )}`
        }

        // Doing a random request to check rpc url is fetchable
        const ldo = ldoHelpers.connectRpc({ chainId, rpc: rpcUrl })
        await ldo.decimals()

        // All fine
        return true
      } catch (err) {
        return 'Given url is not working'
      }
    },
    [chainId, ldoHelpers],
  )

  const validateEtherscanKey = useCallback(
    async (etherscanApiKey: string) => {
      if (!etherscanApiKey) return true
      const errMsg = 'Etherscan api can not be accessed with given key now'
      try {
        // Doing a random request to check etherscan key is viable

        await fetcherEtherscan<string>({
          chainId,
          address: ldoHelpers.address,
          module: 'contract',
          action: 'getabi',
          apiKey: etherscanApiKey,
          useCache: false,
        })
        return true
      } catch (err) {
        return errMsg
      }
    },
    [chainId, ldoHelpers.address],
  )

  const handleReset = useCallback(() => {
    setValue('rpcUrl', '')
    setValue('etherscanApiKey', '')
    setValue('useBundledAbi', true)
    saveSettings(getValues())
    ToastSuccess('Settings have been reset')
  }, [setValue, saveSettings, getValues])

  const isTestnet = getIsTestnet(chainId)

  return (
    <Container as="main" size="tight">
      <Card data-testid="settingsSection">
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
          <Fieldset data-testid="abisBlock">
            <CheckboxLabelWrap>
              <CheckboxControl name="useBundledAbi" />
              Use built-in ABIs
            </CheckboxLabelWrap>
          </Fieldset>
          {isTestnet && (
            <Fieldset data-testid="testContractsBlock">
              <CheckboxLabelWrap>
                <CheckboxControl name="useTestContracts" />
                Use test contracts
              </CheckboxLabelWrap>
            </Fieldset>
          )}
          <Actions>
            <Button
              fullwidth
              variant="translucent"
              children="Reset to defaults"
              onClick={handleReset}
              data-testid="resetBtn"
            />
            <Button
              type="submit"
              fullwidth
              color="primary"
              children="Save"
              loading={formState.isValidating}
              disabled={!formState.isValid || formState.isValidating}
              data-testid="saveBtn"
            />
          </Actions>
        </Form>
      </Card>

      <br />

      <Card>
        <DescriptionText data-testid="faqSection">
          <DescriptionTitle>What are these settings for?</DescriptionTitle>
          <p>
            This website relies on a JSON RPC connection and an Etherscan API
            token. For more reliable operation, consider specifying your own.
            You can get yours by visiting the links below.
          </p>
          <p>
            Ethereum nodes:{' '}
            <a
              target="_blank"
              href="https://ethereumnodes.com/"
              rel="noreferrer"
            >
              ethereumnodes.com
            </a>
            <br />
            Etherscan api key:{' '}
            <a
              target="_blank"
              href="https://etherscan.io/myapikey"
              rel="noreferrer"
            >
              etherscan.io/myapikey
            </a>
          </p>
          <DescriptionTitle>
            What does &ldquo;Use built-in ABIs&rdquo; parameter?
          </DescriptionTitle>
          <p>
            This website includes pre-loaded ABIs for script parsing. If you are
            having trouble viewing the action items, uncheck this box to load
            ABIs from Etherscan.
          </p>
          {isTestnet && (
            <>
              <DescriptionTitle>
                What does &ldquo;Use test contracts&rdquo; parameter?
              </DescriptionTitle>
              <p>
                There may be more than one contract instance on the testnet.
                This parameter allows you to choose between the test and main
                contract.
              </p>
            </>
          )}
        </DescriptionText>
      </Card>
    </Container>
  )
}
