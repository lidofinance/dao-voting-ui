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
  svg {
    transform: rotate(180deg);
  }
`
