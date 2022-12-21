import styled from 'styled-components'

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`

export const InfoLabel = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const InfoValue = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
`

export function InfoRowFull({
  title,
  children,
}: {
  title: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <InfoRow>
      <InfoLabel>{title}</InfoLabel>
      {children && <InfoValue>{children}</InfoValue>}
    </InfoRow>
  )
}
