import styled from 'styled-components'

export const Fieldset = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;

  & > * {
    width: 100%;
  }
`
