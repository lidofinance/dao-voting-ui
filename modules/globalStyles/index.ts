import { createGlobalStyle } from 'styled-components'

export const BREAKPOINT_MOBILE = '780px'

export const GlobalStyle = createGlobalStyle`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
    font-family: 'Manrope', sans-serif;
    margin: 0px;
  }

  html {
    width: 100%;
    height: 100%;
    font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
    line-height: 1.25;
    background-color: ${({ theme }) => theme.colors.background};
  }

  body {
    position: relative;
    width: 100%;
    height: 100%;
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  b {
    font-weight: 600;
  }

  html.html-scroll-lock {
    overflow-y: scroll;
  }

  body.body-scroll-lock {
    overflow: hidden;
    position: fixed;
    height: auto;
  }
`
