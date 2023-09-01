import styled from 'styled-components'
import TenderlySvg from 'assets/tenderly.com.svg.react'

export const TenderlyIcon = styled(TenderlySvg).attrs({
  width: 24,
  height: 24,
})`
  margin-right: ${({ theme }) => theme.spaceMap.sm}px;
`
