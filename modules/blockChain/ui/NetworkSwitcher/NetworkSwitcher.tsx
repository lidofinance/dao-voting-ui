import { useConfig } from 'modules/config/hooks/useConfig'

import { Text } from 'modules/shared/ui/Common/Text'
import { Title } from 'modules/shared/ui/Common/Title'

import { getChainName } from 'modules/blockChain/chains'

export function NetworkSwitcher() {
  const { supportedChainIds } = useConfig()

  return (
    <>
      <Title
        title="Network does not match"
        subtitle={<>Please, switch to one of supported network:</>}
      />
      <Text size={16} weight={500} isCentered>
        {supportedChainIds.map(supportedChainId => (
          <div key={supportedChainId}>{getChainName(supportedChainId)}</div>
        ))}
      </Text>
    </>
  )
}
