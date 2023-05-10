import styled from 'styled-components'

export const AddressBadgeWrap = styled.span`
  display: inline-flex;
  vertical-align: middle;
  padding: 0 8px 0 3px;
  align-items: center;
  justify-content: center;
  height: ${({ theme }) => theme.spaceMap.lg}px;
  width: fit-content;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  background-color: var(--lido-color-backgroundSecondary);
  & > div:nth-child(1) {
    margin-right: 4px;
  }
`
