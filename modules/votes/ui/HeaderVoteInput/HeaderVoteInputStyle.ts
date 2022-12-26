import styled, { css } from 'styled-components'
import { InputNumber } from 'modules/shared/ui/Controls/InputNumber'

export const Input = styled(InputNumber)`
  padding: 0 44px;
  width: 100%;
  height: 44px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};

  & > span {
    padding: 12px 0;
  }
`

export const Wrap = styled.div`
  position: relative;
`

const IconWrapCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  width: 44px;
  height: 44px;
  user-select: none;
  z-index: 9;

  & svg {
    display: block;
    fill: ${({ theme }) => theme.colors.textSecondary};
  }
`

export const SearchIconWrap = styled.div`
  ${IconWrapCSS};
  left: 0;
  pointer-events: none;

  & svg {
    width: 24px;
    height: 24px;
    display: block;
  }
`

export const ClearIconWrap = styled.div`
  ${IconWrapCSS};
  right: 0;
  cursor: pointer;

  & svg {
    width: 16px;
    height: 16px;
    transition: fill ease ${({ theme }) => theme.duration.norm};
  }

  &:hover {
    svg {
      fill: ${({ theme }) => theme.colors.text};
      transition-duration: ${({ theme }) => theme.duration.fast};
    }
  }
`
