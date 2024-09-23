import { ProgressBarContainer, ProgressBarFiller } from './ProgressBarStyle'

interface Props {
  backgroundType: 'primary' | 'secondary' | 'default'
  fillerType: 'active' | 'default'
  progress: number
}

export function ProgressBar({ backgroundType, fillerType, progress }: Props) {
  return (
    <ProgressBarContainer $backgroundType={backgroundType}>
      <ProgressBarFiller $progress={progress} $fillerType={fillerType} />
    </ProgressBarContainer>
  )
}
