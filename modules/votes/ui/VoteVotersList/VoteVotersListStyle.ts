import { Button, Text } from '@lidofinance/lido-ui'
import styled, { css } from 'styled-components'

export const Wrap = styled.div`
  margin-top: ${({ theme }) => theme.spaceMap.lg}px;
`

export const ListRowCell = styled.div`
  display: flex;
  align-items: center;
  min-height: 20px;

  &:nth-child(2) {
    justify-content: center;
  }

  &:nth-child(3) {
    justify-content: flex-end;
    padding-right: 20px;

    svg {
      transition: transform 0.2s ease-in-out;
    }
  }
`

export const ListRow = styled.div<{
  $isDelegate?: boolean
  $isExpanded?: boolean
  $isDelegated?: boolean
}>`
  padding: 12px ${({ theme }) => theme.spaceMap.lg}px;

  display: grid;
  grid-template-columns: 2fr 1fr 1fr;

  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  color: var(--lido-color-text);
  border: 1px solid var(--lido-color-border);

  &:not(:last-child) {
    border-bottom: none;
  }

  &:first-child {
    border-top-left-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
    border-top-right-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  }

  ${({ $isExpanded }) =>
    $isExpanded &&
    css`
      & > ${ListRowCell}:nth-child(3) svg {
        transform: rotate(180deg);
      }
    `}

  ${({ $isDelegate }) =>
    $isDelegate &&
    css`
      cursor: pointer;
      & > ${ListRowCell}:nth-child(3) {
        padding-right: 0;
      }
    `}

    ${({ $isDelegated }) =>
    $isDelegated &&
    css`
      background-color: var(--lido-color-backgroundSecondary);
    `}
`

export const AddressWrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`

export const ShowMoreBtn = styled(Button).attrs({
  variant: 'ghost',
  size: 'sm',
  fullwidth: true,
})`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  border-bottom-right-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  border: 1px solid var(--lido-color-border);
`

export const AddressLabel = styled(Text).attrs({ as: 'span' })`
  min-width: 65px;
`

export const ListRowCellSortable = styled(ListRowCell)<{
  $sortDirection?: 'asc' | 'desc'
}>`
  cursor: pointer;
  user-select: none;

  svg {
    transition: transform 0.2s ease-in-out;
  }

  ${({ $sortDirection }) =>
    $sortDirection === 'asc' &&
    css`
      svg {
        transform: rotate(180deg);
      }
    `}

  ${({ $sortDirection }) =>
    !!$sortDirection &&
    css`
      &:nth-child(3) {
        padding-right: 0;
      }
    `}
`
