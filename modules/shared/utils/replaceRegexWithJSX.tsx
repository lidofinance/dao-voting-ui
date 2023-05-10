import { Fragment } from 'react'

export function replaceRegexWithJSX(
  text: string,
  regex: RegExp,
  replace: (substr: string) => JSX.Element,
) {
  const textArray = text.split(regex)
  return textArray.map((str, i) => {
    const children = regex.test(str) ? replace(str) : str
    return <Fragment key={i}>{children}</Fragment>
  })
}
