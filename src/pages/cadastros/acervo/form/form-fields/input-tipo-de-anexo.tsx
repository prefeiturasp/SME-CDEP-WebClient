import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_TIPO_ANEXO } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.TipoDeAnexo];

type InputTipoAnexoProps = {
  extra?: React.ReactNode;
};
const InputTipoAnexo: React.FC<InputTipoAnexoProps> = ({ extra }) => (
  <Form.Item label={fieldProps.label} name={fieldProps.name} extra={extra}>
    <Input type='text' placeholder={fieldProps.label} maxLength={50} id={CDEP_INPUT_TIPO_ANEXO} />
  </Form.Item>
);

export default InputTipoAnexo;
