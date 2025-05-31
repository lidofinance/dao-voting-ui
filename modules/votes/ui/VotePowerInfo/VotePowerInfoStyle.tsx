import styled from 'styled-components'
import { Text } from '@lidofinance/lido-ui'

export const InfoWrap = styled.div``

export const VotingPower = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`
export const Amount = styled(Text).attrs({
  size: 'xxs',
  weight: 700,
})``
