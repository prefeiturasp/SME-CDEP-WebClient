import { Form, FormItemProps, Select, SelectProps } from 'antd';
import React from 'react';
import { LISTA_UF } from '~/core/constants/lista-uf';

type InputEstadoProps = {
  selectProps: SelectProps;
  formItemProps?: FormItemProps;
};

const InputEstado: React.FC<InputEstadoProps> = ({ selectProps, formItemProps }) => {
  return (
    <Form.Item label='UF' name='estado' rules={[{ required: true }]} {...formItemProps}>
      <Select id='SELECT_UF' {...selectProps} options={LISTA_UF} placeholder='Informe a UF' />
    </Form.Item>
  );
};

export default InputEstado;
