import styled from 'styled-components'

export const ScriptWrap = styled.div`
  position: relative;
`

export const ScriptLoaderWrap = styled.div`
  &,
  &:after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &:after {
    content: '';
    display: block;
    opacity: 0.6;
    background-color: ${({ theme }) => theme.colors.foreground};
  }

  & > * {
    position: absolute;
    top: 50%;
    right: 50%;
  }
`
