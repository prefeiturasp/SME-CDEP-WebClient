import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';

type InputNumeroProps = {
  inputProps: InputProps;
  formItemProps?: FormItemProps;
};

const InputNumero: React.FC<InputNumeroProps> = ({ inputProps, formItemProps }) => {
  return (
    <Form.Item label='Número' name='numero' rules={[{ required: true }]} {...formItemProps}>
      <Input placeholder='Informe o nº' id='INPUT_NUMERO' maxLength={20} {...inputProps} />
    </Form.Item>
  );
};

export default InputNumero;
