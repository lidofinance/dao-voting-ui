// eslint-disable-next-line @typescript-eslint/no-unused-vars
import moment from 'moment'

declare module 'moment-duration-format'

declare module 'moment' {
  interface Duration {
    /**
     * Format a duration like moment-duration-format does
     * @param template e.g. 'h [h] m [min]'
     * @param options trim: 'all'|'left'|'right', minValue, etc.
     */
    format(
      template?: string,
      options?: {
        trim?: 'all' | 'left' | 'right'
        minValue?: number
      },
    ): string
  }
}
