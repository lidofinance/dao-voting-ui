import styled from 'styled-components'

type StatusProps = {
  $supports: boolean
}

export const InfoWrap = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
`

export const VoteStatus = styled.div<StatusProps>`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 8px;

  span {
    background-color: ${({ $supports }) =>
      $supports ? '#53ba9526' : '#E14D4D26'};
    color: ${({ $supports }) => ($supports ? '#53ba95' : '#E14D4D')};
    padding: 6px 8px;
    border-radius: 20px;
    line-height: 1;
  }
`

export const AddressBadgeWrap = styled.span`
  display: inline-flex;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  padding: 2px 10px 2px 4px;
  width: fit-content;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background-color: var(--lido-color-backgroundSecondary);
  & > div:nth-child(1) {
    margin-right: 8px;
  }
`
