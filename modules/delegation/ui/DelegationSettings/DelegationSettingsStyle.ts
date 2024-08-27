import { BREAKPOINT_MOBILE } from 'modules/globalStyles'
import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;

  & > div {
    flex: 1;
  }

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    flex-direction: column;
    align-items: center;
    & > div {
      width: 100%;
      max-width: 542px;
    }
  }
`

export const FormWrap = styled.div<{ $customizable: boolean }>`
  border-radius: 20px;
  background-color: var(--lido-color-foreground);
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  max-width: 496px;

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
