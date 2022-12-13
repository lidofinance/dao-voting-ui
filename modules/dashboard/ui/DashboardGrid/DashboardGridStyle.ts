import styled from 'styled-components'

export const GridWrap = styled.div`
  margin: 0 auto;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  justify-content: space-between;
`

export const PaginationWrap = styled.div`
  margin: ${({ theme }) => theme.spaceMap.xxl}px auto;
  width: fit-content;
`
