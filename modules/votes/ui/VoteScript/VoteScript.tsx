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
}

export function VoteScript({ script }: Props) {
  const [activeTab, setActiveTab] = useState(0)
  const { initialLoading, binary, decoded } = useDecodedScript(script)

  const tabs = useMemo(() => {
    if (!initialLoading && decoded?.calls.length) {
      return ['Parsed', 'JSON', 'Raw']
    }
    return ['Raw']
  }, [decoded, initialLoading])

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
      </VoteScriptBodyWrap>
    </>
  )
}
