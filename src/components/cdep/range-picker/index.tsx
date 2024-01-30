import { DatePicker, Form, FormItemProps } from 'antd';
import { RangePickerProps as RangePickerAntProps } from 'antd/es/date-picker';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import { FC } from 'react';

type RangePickerProps = {
  formItemProps?: FormItemProps;
  rangerPickerProps?: RangePickerAntProps;
};

export const RangePicker: FC<RangePickerProps> = ({ formItemProps, rangerPickerProps }) => {
  const { RangePicker } = DatePicker;
  const dateFormat = 'DD/MM/YYYY';

  return (
    <Form.Item {...formItemProps}>
      <RangePicker
        locale={localeDatePicker}
        format={dateFormat}
        style={{ width: '100%' }}
        id='rangerPicker'
        {...rangerPickerProps}
      />
    </Form.Item>
  );
};
