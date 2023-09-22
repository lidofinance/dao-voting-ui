import styled, { css } from 'styled-components'
import { InputNumber } from 'modules/shared/ui/Controls/InputNumber'

export const Input = styled(InputNumber).attrs({
  isInteger: true,
})`
  height: 44px;

  & > span {
    padding: 12px 0;
    background-color: var(--lido-color-backgroundSecondary);

    & > span:first-child {
      padding-right: 0;
    }
  }
`

const IconWrapCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  user-select: none;

  & svg {
    display: block;
    fill: var(--lido-color-textSecondary);
  }
`

export const SearchIconWrap = styled.div`
  ${IconWrapCSS};
  pointer-events: none;

  & svg {
    width: 24px;
    height: 24px;
    display: block;
  }
`

export const ClearIconWrap = styled.div`
  ${IconWrapCSS};
  cursor: pointer;

  & svg {
    width: 16px;
    height: 16px;
    transition: fill ease ${({ theme }) => theme.duration.norm};
  }

  &:hover {
    svg {
      fill: var(--lido-color-text);
      transition-duration: ${({ theme }) => theme.duration.fast};
    }
  }
`
