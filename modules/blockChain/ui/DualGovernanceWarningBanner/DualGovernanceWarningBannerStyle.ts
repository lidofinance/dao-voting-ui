import styled from 'styled-components'

export const DualGovernanceWarningBannerWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  p {
    color: white;
  }
`

export const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;

  svg {
    transform: rotate(180deg);
  }
`
