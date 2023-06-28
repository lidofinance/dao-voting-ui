import React from 'react'
import dynamic from 'next/dynamic'

const Wrapper = (props: { children: React.ReactNode }) => <>{props.children}</>

export const NoSSRWrapper = dynamic(() => Promise.resolve(Wrapper), {
  ssr: false,
})
