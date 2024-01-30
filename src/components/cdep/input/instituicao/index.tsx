import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';

type InputInstituicaoProps = {
  inputProps: InputProps;
  formItemProps?: FormItemProps;
};

const InputInstituicao: React.FC<InputInstituicaoProps> = ({ inputProps, formItemProps }) => {
  return (
    <Form.Item label='Instituição/Empresa' name='instituicao' rules={[{ required: true }]} {...formItemProps}>
      <Input placeholder='Informe a instituição ou empresa' id='INPUT_INSTITUICAO' maxLength={100} {...inputProps} />
    </Form.Item>
  );
};

export default InputInstituicao;
