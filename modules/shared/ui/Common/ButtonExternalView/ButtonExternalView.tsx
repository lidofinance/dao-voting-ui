import { useCallback } from 'react'
import { ButtonIcon, External, ButtonVariants } from '@lidofinance/lido-ui'
import { openWindow } from 'modules/shared/utils/openWindow'

type Props = {
  link?: string
  onClick?: () => void
  variant?: ButtonVariants
  children: React.ReactNode
}

export function ButtonExternalView({
  children,
  link,
  onClick,
  ...rest
}: Props) {
  const handleClick = useCallback(() => {
    if (link) openWindow(link)
    onClick?.()
  }, [onClick, link])
  return (
    <ButtonIcon
      onClick={handleClick}
      icon={<External />}
      size="xs"
      variant="ghost"
      children={children}
      {...rest}
    />
  )
}
