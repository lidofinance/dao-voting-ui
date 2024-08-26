import styled from 'styled-components'

export const Wrap = styled.div<{ $customizable: boolean }>`
  border-radius: 20px;
  background-color: var(--lido-color-foreground);
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;

  ${({ $customizable }) =>
    $customizable &&
    `
    padding: 32px 24px;
  `}
`

export const FormTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
