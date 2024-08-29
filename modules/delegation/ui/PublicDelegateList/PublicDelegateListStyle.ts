import { Text } from '@lidofinance/lido-ui'
import { BREAKPOINT_MOBILE, BREAKPOINT_MD } from 'modules/globalStyles'
import styled from 'styled-components'

export const Wrap = styled.div`
  padding: 32px 24px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background-color: var(--lido-color-foreground);
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 542px;
  min-width: 460px;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    min-width: unset;
    max-height: unset;
  }

  @media (max-width: ${BREAKPOINT_MD}) {
    padding: 20px;
  }
`

export const InnerWrap = styled.div<{ $connected: boolean }>`
  border-radius: inherit;
  border: 1px solid var(--lido-color-border);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  & > div {
    display: grid;
    gap: 10px;
    grid-template-columns: minmax(130px, 3fr) repeat(2, minmax(42px, 1fr)) 40px ${({
        $connected,
      }) => ($connected ? 'minmax(0, 85px)' : '')};

    @media (max-width: ${BREAKPOINT_MD}) {
      display: flex;
    }
  }
`

export const Header = styled.div`
  padding: 24px 12px 16px 12px;
  position: sticky;
  top: 0;
  background-color: var(--lido-color-foreground);
  z-index: 2;
  border-bottom: 1px solid var(--lido-color-border);
`

export const HeaderTitleWithIcon = styled(Text).attrs({
  size: 'xxs',
  weight: 700,
})`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const ListItem = styled.div`
  align-items: center;
  padding: 12px;

  &:nth-child(odd) {
    background-color: var(--lido-color-background);
  }

  @media (max-width: ${BREAKPOINT_MD}) {
    padding: 20px 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
`
export const DelegateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: ${BREAKPOINT_MD}) {
    gap: 12px;
  }
`

export const AvatarWrap = styled.div`
  position: relative;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  overflow: hidden;
  flex-shrink: 0;

  & > img,
  & > svg {
    width: 100%;
    height: 100%;
  }

  & > img[src=''] {
    display: none;
  }

  @media (max-width: ${BREAKPOINT_MD}) {
    width: 32px;
    height: 32px;
  }
`

export const SocialButtons = styled.div`
  display: flex;
  gap: 6px;

  & > span {
    height: 16px;

    & > svg path {
      transition: fill ease ${({ theme }) => theme.duration.norm};
    }

    &:hover > svg path {
      fill: var(--lido-color-primaryHover);
    }
  }

  @media (max-width: ${BREAKPOINT_MD}) {
    & > span {
      height: 24px;
    }

    svg {
      width: 24px;
      height: 24px;
    }
  }
`

export const DelegateNameAndAddress = styled.div`
  max-width: calc(100% - 36px);

  & > p,
  & > span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  @media (max-width: ${BREAKPOINT_MD}) {
    max-width: 100%;
    flex: 1;
  }
`

export const DelegateNumbersMobile = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 32px;
`
