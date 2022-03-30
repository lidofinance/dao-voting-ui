import styled from 'styled-components'
import { IdenticonBadge } from '@lidofinance/lido-ui'

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 44px;
  align-items: center;
  justify-content: center;
`

export const Disconnect = styled.button`
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
`

export const AddressBadge = styled(IdenticonBadge)`
  cursor: pointer;
  font-size: 12px;
  background: rgba(39, 56, 82, 0.1);
`
