import { themeDefault } from '@lidofinance/lido-ui'
import { createGlobalStyle } from 'styled-components'

export const BREAKPOINT_MOBILE = '960px'
export const BREAKPOINT_MD = themeDefault.breakpointsMap.md.width
export const HEADER_HEIGHT = '76px'

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
    background-color: var(--lido-color-backgroundSecondary);
  }

  body {
    position: relative;
    width: 100%;
    height: 100%;
    color: var(--lido-color-text);
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
