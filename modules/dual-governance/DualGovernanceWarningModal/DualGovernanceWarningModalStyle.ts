import styled from 'styled-components'
import WarningIconSVG from 'assets/warning.com.svg.react'

export const WarningIcon = styled(WarningIconSVG)`
  path {
    fill: #e14d4d;
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
  gap: 12px;

  button {
    width: 100%;
    text-align: center;
  }

  @media (max-width: 410px) {
    flex-direction: column;
  }
`
