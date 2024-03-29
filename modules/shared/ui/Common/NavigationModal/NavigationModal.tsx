import { useCallback } from 'react'
import {
  Text,
  Modal,
  ModalProps,
  ButtonIcon,
  External,
} from '@lidofinance/lido-ui'
import { openWindow } from 'modules/shared/utils/openWindow'
import { NavigationModalBody } from './NavigationModalStyles'
import type { Data } from 'modules/modal/ModalProvider'

const trustedSites = ['https://research.lido.fi/', 'https://snapshot.org/']

interface NavigationModalProps extends ModalProps {
  data?: Data
}

export function NavigationModal(props: NavigationModalProps) {
  const { onClose, data } = props
  const link = data?.href ? `${data.href}` : ''
  const handleClick = useCallback(() => {
    if (link) openWindow(link)
    onClose?.()
  }, [onClose, link])

  const isTrusted = trustedSites.some(trustedSite =>
    link.startsWith(trustedSite),
  )
  const notice = isTrusted
    ? 'Site is reputable, but content may vary.'
    : 'Proceed carefully and read the address before opening.'
  return (
    <Modal title="External Link" center {...props}>
      <NavigationModalBody>
        <Text as="p" size="xs" weight={400}>
          {`You're about to visit: `}
          <Text as="span" size="xs" weight={700}>
            {link}.
          </Text>
        </Text>
        <Text as="p" size="xs">
          {notice}
        </Text>
      </NavigationModalBody>
      <ButtonIcon icon={<External />} onClick={handleClick}>
        Open
      </ButtonIcon>
    </Modal>
  )
}
