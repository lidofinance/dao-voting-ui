import styled from 'styled-components'

export const Actions = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`

export const DescriptionText = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;

  & p:not(:last-child) {
    margin-bottom: 8px;
  }

  & a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const DescriptionTitle = styled.div`
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};

  &:not(:first-child) {
    margin-top: 16px;
  }
`
