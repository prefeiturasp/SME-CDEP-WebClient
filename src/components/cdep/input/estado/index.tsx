import { Form, FormItemProps, Select, SelectProps } from 'antd';
import React from 'react';
import { LISTA_UF } from '~/core/constats/lista-uf';

type InputEstadoProps = {
  selectProps: SelectProps;
  formItemProps?: FormItemProps;
};

const InputEstado: React.FC<InputEstadoProps> = ({ selectProps, formItemProps }) => {
  return (
    <Form.Item label='UF' name='estado' rules={[{ required: true }]} {...formItemProps}>
      <Select placeholder='Informe a UF' options={LISTA_UF} id='SELECT_UF' {...selectProps} />
    </Form.Item>
  );
};

export default InputEstado;
