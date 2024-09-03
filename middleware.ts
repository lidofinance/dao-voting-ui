import { cacheControlMiddlewareFactory } from '@lidofinance/next-cache-files-middleware'

export const CACHE_HEADERS_HTML_PAGE =
  'public, max-age=30, stale-if-error=1200, stale-while-revalidate=30'
export const CACHE_ALLOWED_LIST_FILES_PATHS = [
  { path: '/', headers: CACHE_HEADERS_HTML_PAGE },
  { path: '/settings', headers: CACHE_HEADERS_HTML_PAGE },
  { path: /vote\/(.+)/, headers: CACHE_HEADERS_HTML_PAGE },
  { path: /dashboard\/(.+)/, headers: CACHE_HEADERS_HTML_PAGE },
  { path: '/delegation', headers: CACHE_HEADERS_HTML_PAGE },
  { path: '/delegation/delegators', headers: CACHE_HEADERS_HTML_PAGE },
]

// use only for cache files
export const middleware = cacheControlMiddlewareFactory(
  CACHE_ALLOWED_LIST_FILES_PATHS,
)

export const config = {
  // paths where use middleware
  matcher: [
    '/manifest.json',
    '/favicon:size*',
    '/',
    '/settings',
    '/vote/:voteId*',
    '/dashboard/:page*',
    '/delegation',
    '/delegation/delegators',
  ],
}

export default middleware
