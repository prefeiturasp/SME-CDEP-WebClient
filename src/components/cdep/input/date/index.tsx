import { DatePicker, DatePickerProps, Form, FormItemProps } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';

import dayjs, { Dayjs } from 'dayjs';
import React from 'react';

type InputDatePickerProps = {
  dateProps: DatePickerProps;
  formItemProps?: FormItemProps;
};
const formatoData = 'DD/MM/YYYY';
const InputDatePicker: React.FC<InputDatePickerProps> = ({ dateProps, formItemProps }) => {
  const customCellRender: DatePickerProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type !== 'date')
      return info.originNode;
    return (
      <div className="ant-picker-cell-inner" title={dayjs(current).format(formatoData)}>
        {dayjs(current).date()}
      </div>
    );
  };

  return (
    <Form.Item label='Data' name='Data' {...formItemProps}>
      <DatePicker
            placeholder='Selecione uma data'
            id='INPUT_DATE'
            format={formatoData}
            locale={localeDatePicker}
            cellRender={customCellRender}
            {...dateProps}
          />
    </Form.Item>
  );
};

export default InputDatePicker;
