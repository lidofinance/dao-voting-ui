import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 44px;
  align-items: center;
  justify-content: center;
`

export const Disconnect = styled.button`
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
`

export const AddressBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spaceMap.sm}px;
  height: 44px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.foreground};
  user-select: none;
  cursor: pointer;
`

export const AddressText = styled.div`
  margin-left: ${({ theme }) => theme.spaceMap.xs}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizesMap.sm};
`
