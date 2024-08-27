import { Text } from '@lidofinance/lido-ui'
import { BREAKPOINT_MOBILE } from 'modules/globalStyles'
import styled from 'styled-components'

export const Wrap = styled.div`
  padding: 32px 24px;
  border-radius: 20px;
  background-color: var(--lido-color-foreground);
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 542px;
  max-height: 492px;
  overflow: hidden;
`

export const InnerWrap = styled.div<{ $connected: boolean }>`
  border-radius: 20px;
  border: 1px solid var(--lido-color-border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 310px;
  border-radius: inherit;

  & > div {
    display: grid;
    gap: 10px;
    grid-template-columns: 3fr 1fr 1fr 40px ${({ $connected }) =>
        $connected ? '2fr' : ''};

    @media (max-width: ${BREAKPOINT_MOBILE}) {
      grid-template-columns: 2fr ${({ $connected }) =>
          $connected ? '1fr' : ''};
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

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    & > *:nth-child(2),
    & > *:nth-child(3),
    & > *:nth-child(4) {
      display: none;
    }
  }
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

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    & > *:nth-child(2),
    & > *:nth-child(3),
    & > *:nth-child(4) {
      display: none;
    }
  }
`
export const DelegateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const AvatarWrap = styled.div`
  position: relative;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  background-color: var(--lido-color-primaryVisited);
  overflow: hidden;

  & > img,
  div {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  & > img[src=''] {
    display: none;
  }
`

export const Avatar = styled.img`
  border-radius: 50%;
  width: 28px;
  height: 28px;
`

export const SocialButtons = styled.div`
  display: flex;
  gap: 6px;

  & > span {
    max-height: 16px;
  }
`
