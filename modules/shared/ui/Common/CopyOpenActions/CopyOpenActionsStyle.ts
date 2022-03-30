import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;

  & > *:not(:last-child) {
    margin-right: 10px;
  }
`
