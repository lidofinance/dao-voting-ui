const PATTERN_URL = '((?:https?://|www\\.)[^\\s]+)'
export const REGEX_URL = new RegExp(`${PATTERN_URL}`, 'g')
export const REGEX_URL_ONLY = new RegExp(`^${PATTERN_URL}$`)
