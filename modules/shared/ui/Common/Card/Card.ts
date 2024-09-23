import styled from 'styled-components'
import { Block } from '@lidofinance/lido-ui'

export const Card = styled(Block).attrs({
  paddingLess: true,
})`
  box-shadow: ${({ theme }) => theme.boxShadows.xl}
    var(--lido-color-shadowLight);
  padding: 20px;
`
