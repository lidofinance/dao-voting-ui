import { useState, useMemo } from 'react'
import { useDecodedScript } from 'modules/votes/hooks/useDecodedScript'

import { Loader } from '@lidofinance/lido-ui'
import {
  Tabs,
  Tab,
  VoteScriptBodyWrap,
  ScriptLoaderWrap,
} from './VoteScriptStyle'
import { VoteScriptBody } from './VoteScriptBody'

type Props = {
  script: string
  metadata?: string
}

export function VoteScript({ script, metadata = '' }: Props) {
  const [activeTab, setActiveTab] = useState(0)
  const { initialLoading, binary, decoded } = useDecodedScript(script)

  const tabs = useMemo(() => {
    const tabMap = {
      Parsed: !initialLoading && decoded?.calls.length,
      JSON: !initialLoading && decoded?.calls.length,
      Raw: true,
      Items: Boolean(metadata),
    }
    const TabNames = Object.keys(tabMap) as (keyof typeof tabMap)[]
    return TabNames.filter(key => tabMap[key])
  }, [decoded?.calls.length, initialLoading, metadata])

  return (
    <>
      <Tabs>
        {tabs.map((tab, i) => (
          <Tab
            key={tab}
            isActive={activeTab === i}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </Tab>
        ))}
      </Tabs>
      <VoteScriptBodyWrap>
        {initialLoading && (
          <ScriptLoaderWrap>
            <Loader size="medium" />
          </ScriptLoaderWrap>
        )}

        {tabs[activeTab] === 'Raw' && <VoteScriptBody binary={binary} />}

        {tabs[activeTab] === 'JSON' && (
          <VoteScriptBody binary={JSON.stringify(decoded, null, 2)} />
        )}

        {tabs[activeTab] === 'Parsed' && (
          <VoteScriptBody binary={binary} decoded={decoded} />
        )}
        {tabs[activeTab] === 'Items' && <VoteScriptBody binary={metadata} />}
      </VoteScriptBodyWrap>
    </>
  )
}
