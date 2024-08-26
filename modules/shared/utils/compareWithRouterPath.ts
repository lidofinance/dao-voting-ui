export const compareWithRouterPathInInfra = (asPath: string, href: string) => {
  // '/wrap/?ref=123#dsfdsf' ---> '/wrap/'
  const pathWithoutQueryString = asPath.split('?')[0]

  // '/wrap/' ---> '/wrap'
  const pathWithoutLastSlash =
    pathWithoutQueryString.slice(-1) === '/'
      ? pathWithoutQueryString.slice(0, -1)
      : pathWithoutQueryString

  return pathWithoutLastSlash === href
}
