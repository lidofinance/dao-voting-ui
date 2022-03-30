import styled from 'styled-components'
import { Loader } from '@lidofinance/lido-ui'

const Wrap = styled.div`
  padding: 40px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

export function PageLoader() {
  return (
    <Wrap>
      <Loader size="medium" />
    </Wrap>
  )
}
