import { DashboardGrid } from 'modules/dashboard/ui/DashboardGrid'

export default function AboutPage() {
  return <DashboardGrid currentPage={1} />
}

// #!if IPFS_MODE !== "true"
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
// #!endif
