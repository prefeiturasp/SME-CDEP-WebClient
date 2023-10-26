import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';
import { CDEP_INPUT_TIPO_AUTORIA } from '~/core/constants/ids/input';

interface InputTipoAutoriaProps {
  inputProps: InputProps;
  formItemProps: FormItemProps;
}

const InputTipoAutoria: React.FC<InputTipoAutoriaProps> = ({ inputProps, formItemProps }) => {
  return (
    <Form.Item label='Tipo de autoria' name='tipoAutoria' {...formItemProps}>
      <Input
        type='text'
        placeholder='Tipo de autoria'
        maxLength={15}
        id={CDEP_INPUT_TIPO_AUTORIA}
        {...inputProps}
      />
    </Form.Item>
  );
};

export default InputTipoAutoria;
