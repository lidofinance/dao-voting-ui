import { DashboardGrid } from 'modules/dashboard/ui/DashboardGrid'

export default function AboutPage() {
  return <DashboardGrid />
}

// #!if IPFS_MODE !== "true"
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
// #!endif
