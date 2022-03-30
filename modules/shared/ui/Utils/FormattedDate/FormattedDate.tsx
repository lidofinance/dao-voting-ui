import moment from 'moment'
import { useMemo } from 'react'

type Props = {
  date: number
  format: string
}

export function FormattedDate({ date, format }: Props) {
  const formatted = useMemo(
    () => moment.unix(date).format(format),
    [date, format],
  )

  return <>{formatted}</>
}
