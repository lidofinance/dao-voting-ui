import styled from 'styled-components'
import { Checkbox } from '@lidofinance/lido-ui'
import { withFormController } from 'modules/shared/hocs/withFormController'
import { mapPropsWithRef } from 'modules/shared/utils/mapPropsWithRef'

type OwnProps = React.ComponentProps<typeof Checkbox>
type MappedProps = Omit<OwnProps, 'value' | 'checked' | 'onChange'> & {
  value: boolean
  onChange: (e: boolean) => void
}

const withMappedProps = mapPropsWithRef<OwnProps, MappedProps>(
  ({ value, onChange, ...props }) => ({
    ...props,
    checked: value,
    onChange: e => onChange(e.target.checked),
  }),
)

export const CheckboxControl = withFormController(withMappedProps(Checkbox))

export const CheckboxLabelWrap = styled.label`
  display: flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
  width: fit-content;

  & > * {
    margin-right: 10px;
  }
`
