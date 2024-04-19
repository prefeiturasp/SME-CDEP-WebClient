import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_TECNICA } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Tecnica];

type InputTecnicaProps = {
  extra?: React.ReactNode;
};
const InputTecnica: React.FC<InputTecnicaProps> = ({ extra }) => (
  <Form.Item label={fieldProps.label} name={fieldProps.name} extra={extra}>
    <Input type='text' placeholder={fieldProps.label} maxLength={100} id={CDEP_INPUT_TECNICA} />
  </Form.Item>
);

export default InputTecnica;
