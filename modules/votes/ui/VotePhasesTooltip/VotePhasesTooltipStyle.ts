import styled from 'styled-components'
import { Text } from '@lidofinance/lido-ui'

export const TooltipText = styled(Text).attrs({
  size: 'xxs',
  weight: 400,
})`
  color: var(--lido-color-contrast);
`

export const LinkWrap = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
  line-height: 1;
`
