import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';
import { CDEP_INPUT_TIPO_AUTORIA } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

interface InputTipoAutoriaProps {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
}

const InputTipoAutoria: React.FC<InputTipoAutoriaProps> = ({ inputProps, formItemProps }) => {
  return (
    <Form.Item
      label='Tipo de autoria'
      name={AcervoFieldName[FieldAcervoEnum.TipoAutoria]}
      {...formItemProps}
    >
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
