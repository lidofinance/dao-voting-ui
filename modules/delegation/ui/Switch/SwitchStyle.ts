import styled from 'styled-components'
import { LocalLink } from 'modules/shared/ui/Common/LocalLink'

export const SwitchWrapper = styled.div`
  width: 275px;
  height: 44px;
  background-color: var(--lido-color-backgroundDarken);
  border-radius: 100px;
  position: relative;
  :hover {
    cursor: pointer;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  margin: 0 auto 20px auto;
`

export const Highlight = styled.div<{ $checked: boolean }>`
  width: ${({ $checked }) => ($checked ? '171px' : '100px')};
  left: ${({ $checked }) => ($checked ? 'calc(100% - 173px)' : '2px')};
  height: 40px;
  background-color: var(--lido-color-foreground);
  border-radius: 100px;
  position: absolute;
  transition: left 0.3s ease, width 0.3s ease;
  top: 2px;
  z-index: 1;
`

// Not wrapping <a> inside <a> in IPFS mode
// Also avoid problems with migrate to Next v13
// see: https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#link-component
export const SwitchItemStyled = styled(LocalLink)<{ $active: boolean }>`
  z-index: 2;
  margin: 0;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  transition: opacity 0.3s ease;
  text-decoration: none;
  // flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-transform: uppercase;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.3px;
  font-weight: 800;
  padding: 8px 24px;

  color: var(--lido-color-text);

  &:hover {
    color: var(--lido-color-text);
    opacity: 1;
  }

  &:visited {
    color: var(--lido-color-text);
  }
`
