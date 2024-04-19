import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';
import { CDEP_INPUT_TIPO_AUTORIA } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.TipoAutoria];
interface InputTipoAutoriaProps {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
}
const InputTipoAutoria: React.FC<InputTipoAutoriaProps> = ({ inputProps, formItemProps }) => (
  <Form.Item label={fieldProps.label} name={fieldProps.name} {...formItemProps}>
    <Input
      type='text'
      placeholder={fieldProps.label}
      maxLength={15}
      id={CDEP_INPUT_TIPO_AUTORIA}
      {...inputProps}
    />
  </Form.Item>
);

export default InputTipoAutoria;
