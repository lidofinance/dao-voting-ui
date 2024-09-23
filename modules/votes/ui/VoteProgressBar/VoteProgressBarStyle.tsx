import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  gap: 4px;
  width: 100%;
  align-items: flex-start;
  margin-bottom: 10px;
`

export const ProgressWrap = styled.div<{
  $alignDescription: string
  $width: string
}>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: ${props => props.$alignDescription};
  width: ${props => props.$width};
`

export const MainPhaseCountWrap = styled.div`
  display: flex;
  gap: 4px;
  color: #00a3ff;
  line-height: normal;
`
