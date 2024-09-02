import {
  BREAKPOINT_MD,
  BREAKPOINT_MOBILE,
  HEADER_HEIGHT,
} from 'modules/globalStyles'
import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;

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
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background-color: var(--lido-color-foreground);
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  max-width: 496px;
  position: sticky;
  top: calc(${HEADER_HEIGHT} + 20px);

  ${({ $customizable }) =>
    $customizable &&
    `
    padding: 32px 24px;
  `}

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    position: static;
  }

  @media (max-width: ${BREAKPOINT_MD}) {
    padding: 20px;
  }
`

export const FormTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
