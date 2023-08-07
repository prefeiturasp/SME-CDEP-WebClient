import { Form, FormItemProps, Select, SelectProps } from 'antd';
import React from 'react';
import { LISTA_UF } from '~/core/constants/lista-uf';

type InputEstadoProps = {
  estadoValue?: string;
  selectProps: SelectProps;
  formItemProps?: FormItemProps;
};

const InputEstado: React.FC<InputEstadoProps> = ({ estadoValue, selectProps, formItemProps }) => {
  return (
    <Form.Item label='UF' name='estado' rules={[{ required: true }]} {...formItemProps}>
      <Select
        id='SELECT_UF'
        {...selectProps}
        options={LISTA_UF}
        value={estadoValue}
        placeholder='Informe a UF'
      />
    </Form.Item>
  );
};

export default InputEstado;
