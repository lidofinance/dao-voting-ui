import { Header } from '../Header'

type Props = {
  children: React.ReactNode
}

export function PageLayout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  )
}
