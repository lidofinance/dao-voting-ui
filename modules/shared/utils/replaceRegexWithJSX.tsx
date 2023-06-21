import { Fragment } from 'react'

export const REGEX_REPLACER_HINT = /(__\$\d+__)/g
export const REGEX_REPLACER_INDEX = /__\$(\d+)__/g

type ReplaceRule = {
  regex: RegExp
  replace: (substr: string) => JSX.Element
}

export function replaceRegexWithJSX(text: string, rules: ReplaceRule[]) {
  let textBuffer = text
  const jsxBuffer: JSX.Element[] = []

  rules.forEach(rule => {
    textBuffer = textBuffer.replaceAll(rule.regex, match => {
      jsxBuffer.push(rule.replace(match))
      return `__$${jsxBuffer.length - 1}__`
    })
  })

  const textArray = textBuffer.split(REGEX_REPLACER_HINT)

  const result = textArray.map((str, i) => {
    const test = REGEX_REPLACER_INDEX.exec(str)
    const children = test ? jsxBuffer[Number(test[1])] : str
    return <Fragment key={i}>{children}</Fragment>
  })

  return result
}
