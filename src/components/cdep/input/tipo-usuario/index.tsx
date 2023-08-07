import { Form, FormItemProps, Select, SelectProps } from 'antd';
import React from 'react';
import { LISTA_TIPO_USUARIO } from '~/core/constants/lista-tipo-usuario';

type InputTipoUsuarioProps = {
  selectProps: SelectProps;
  formItemProps?: FormItemProps;
};

const InputTipoUsuario: React.FC<InputTipoUsuarioProps> = ({ selectProps, formItemProps }) => {
  return (
    <Form.Item label='Tipo' name='tipo' rules={[{ required: true }]} {...formItemProps}>
      <Select
        id='SELECT_TIPO_USUARIO'
        {...selectProps}
        options={LISTA_TIPO_USUARIO}
        placeholder='Informe o tipo de usuário'
      />
    </Form.Item>
  );
};

export default InputTipoUsuario;
