import styled from 'styled-components'
import { Text } from '@lidofinance/lido-ui'

const TitleWrap = styled.div`
  margin-bottom: 48px;
`

const TitleStyle = styled(Text).attrs({
  size: 'xl',
  weight: 800,
})`
  line-height: 1;
  text-align: center;
`

const Subtitle = styled(Text).attrs({
  size: 'xxs',
  weight: 500,
})`
  margin-top: ${({ theme }) => theme.spaceMap.sm}px;
  opacity: 0.6;
  text-align: center;
`

type Props = {
  title: React.ReactNode
  subtitle?: React.ReactNode
}

export function Title({ title, subtitle }: Props) {
  return (
    <TitleWrap>
      <TitleStyle children={title} />
      {subtitle && <Subtitle children={subtitle} />}
    </TitleWrap>
  )
}
