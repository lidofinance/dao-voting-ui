import { getBulbColor } from '../../utils'
import { DualGovernanceStatus } from '../../types'
import styled from 'styled-components'

export const DualGovernanceWidgetWrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 280px;
  gap: 8px;
  border-radius: 10px;
  background-color: rgba(39, 39, 46, 1);

  & p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
`

type StatusBulbProps = { $status: DualGovernanceStatus }
export const StatusBulb = styled.div<StatusBulbProps>`
  margin-right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $status }) => getBulbColor($status)};
`

type LabelProps = {
  $size?: 12 | 14
  $weight?: 400 | 700
  $color?: 'default' | 'secondary'
}
export const Label = styled.span<LabelProps>`
  font-family: inherit;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  font-size: ${({ $size }) => $size || 12}px;
  font-weight: ${({ $weight }) => $weight || 400};
  color: #ffffff;
  opacity: ${({ $color }) => ($color === 'secondary' ? 0.5 : 1)};
  display: inline-flex;
  align-items: center;
`

export const CheckLink = styled.a`
  padding: 6px;
  margin-top: 8px;
  display: flex;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 163, 255, 0.1);
  color: rgba(0, 163, 255, 1);
  border-radius: 6px;
  text-decoration: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
`
