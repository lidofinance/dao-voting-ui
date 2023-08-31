import { ReactNode } from 'react'

import { getUseModal } from 'modules/modal/useModal'

import { NavigationModal } from '../NavigationModal'
import { ExternalLinkWrap } from './ExternalLinkStyle'

export const useNavigationModal = getUseModal(NavigationModal)

type Props = {
  href?: string
  children: ReactNode
}

export function ExternalLink({ href = '', children }: Props) {
  const openNavigationModal = useNavigationModal({ href })

  return (
    <ExternalLinkWrap onClick={openNavigationModal}>
      {children}
    </ExternalLinkWrap>
  )
}
