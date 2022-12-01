import styled, { css } from 'styled-components'
import { VoteStatus } from 'modules/votes/types'
import { VoteStatusBannerSize } from './types'

export const BannerText = styled.div``

export const InfoText = styled(BannerText)`
  margin-right: 0;
  margin-left: auto;
`

const Badge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spaceMap.sm}px;
  width: ${({ theme }) => theme.spaceMap.lg}px;
  height: ${({ theme }) => theme.spaceMap.lg}px;

  & svg {
    display: block;
  }
`

export const BadgePassed = styled(Badge)`
  & svg {
    width: 16px;
    height: 16px;
    fill: ${({ theme }) => theme.colors.success};
  }
`

export const BadgeFailed = styled(Badge)`
  & svg {
    width: 16px;
    height: 16px;
    fill: ${({ theme }) => theme.colors.error};
  }
`

export const BadgeOngoing = styled(Badge)`
  color: #fff;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 700;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.primary};
`

type WrapProps = { status?: VoteStatus; size?: VoteStatusBannerSize }
export const Wrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
  padding: 10px;
  font-weight: 400;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;

  ${({ size }: WrapProps) =>
    size === 'small'
      ? css`
          font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
        `
      : css`
          font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
        `}

  ${({ status }: WrapProps) =>
    (status === VoteStatus.ActiveMain ||
      status === VoteStatus.ActiveObjection) &&
    css`
      background-color: rgba(0, 163, 255, 0.1);

      & ${BannerText} {
        color: #00a3ff;
      }
    `}

  ${({ status }: WrapProps) =>
    (status === VoteStatus.Pending ||
      status === VoteStatus.Executed ||
      status === VoteStatus.Passed) &&
    css`
      background-color: rgba(83, 186, 149, 0.1);

      & ${BannerText} {
        color: ${({ theme }) => theme.colors.success};
      }
    `}

  ${({ status }: WrapProps) =>
    status === VoteStatus.Rejected &&
    css`
      background-color: rgba(225, 77, 77, 0.1);

      & ${BannerText} {
        color: ${({ theme }) => theme.colors.error};
      }
    `}
`
