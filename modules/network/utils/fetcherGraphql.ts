import { fetcherStandard } from './fetcherStandard'

export function fetcherGraphql<T>(url: string, query: string) {
  return fetcherStandard<T>(url, {
    method: 'POST',
    body: JSON.stringify({ query }),
  })
}
