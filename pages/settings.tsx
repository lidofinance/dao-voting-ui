import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { SettingsForm } from 'modules/config/ui/SettingsForm'

export default function AboutPage() {
  const { chainId } = useWeb3()

  return <SettingsForm key={chainId} />
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
