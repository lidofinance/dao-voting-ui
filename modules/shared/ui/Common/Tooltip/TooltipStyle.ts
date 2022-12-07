import styled, { css } from 'styled-components'

type WrapProps = { fitContent?: boolean }
export const Wrap = styled.div<WrapProps>`
  position: relative;
  ${({ fitContent }) =>
    fitContent &&
    css`
      width: fit-content;
    `}
`

export type Position =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'

const positionStyles = {
  'top-left': css`
    left: 0;
    bottom: calc(100% + 6px);
    transform-origin: 0 calc(100% - 8px);
  `,
  top: css`
    left: 50%;
    bottom: calc(100% + 8px);
    transform-origin: 50% calc(100% - 8px);
    transform: translateX(-50%) scale(0.6);

    ${Wrap}:hover & {
      transform: translateX(-50%) scale(1);
    }
  `,
  'top-right': css`
    right: 0;
    bottom: calc(100% + 6px);
    transform-origin: 100% calc(100% - 8px);
  `,
  'bottom-left': css`
    left: 0;
    top: calc(100% + 6px);
    transform-origin: 0% -8px;
  `,
  bottom: css`
    left: 50%;
    top: calc(100% + 8px);
    transform-origin: 50% -8px;
    transform: translateX(-50%) scale(0.6);

    ${Wrap}:hover & {
      transform: translateX(-50%) scale(1);
    }
  `,
  'bottom-right': css`
    right: 0;
    top: calc(100% + 6px);
    transform-origin: 100% -8px;
  `,
}

type BodyProps = { position: Position }
export const Body = styled.div<BodyProps>`
  z-index: 1;
  position: absolute;
  padding: ${({ theme }) => theme.spaceMap.sm}px
    ${({ theme }) => theme.spaceMap.md}px;
  opacity: 0;
  width: max-content;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  background-color: rgba(0, 0, 0, 0.8);
  pointer-events: none;
  transform: scale(0.6);
  transition: ${({ theme }) =>
    `opacity ease ${theme.duration.norm}, transform ${theme.ease.outBack} ${theme.duration.norm}`};

  ${Wrap}:hover & {
    opacity: 1;
    transform: scale(1);
    pointer-events: initial;
  }

  ${({ position }) => positionStyles[position]}
`
