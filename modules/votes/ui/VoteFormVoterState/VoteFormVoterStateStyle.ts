import styled from 'styled-components'

export const Wrap = styled.div`
  padding: 20px;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text};
  background-color: #fffae0;
  border-radius: 10px;

  b {
    font-weight: 700;
  }

  p {
    &:not(:last-child) {
      margin-bottom: 4px;
    }
  }

  &:empty {
    display: none;
  }
`
