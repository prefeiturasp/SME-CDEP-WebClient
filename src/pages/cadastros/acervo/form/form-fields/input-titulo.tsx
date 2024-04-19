import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_TITULO } from '~/core/constants/ids/input';
import { PropsByFieldAcervoEnum, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Titulo];

type InputTituloProps = {
  extra?: React.ReactNode;
};
const InputTitulo: React.FC<InputTituloProps> = ({ extra }) => (
  <Form.Item
    label={fieldProps.label}
    name={fieldProps.name}
    rules={[{ required: true, whitespace: true }]}
    extra={extra}
  >
    <Input type='text' placeholder={fieldProps.label} maxLength={500} id={CDEP_INPUT_TITULO} />
  </Form.Item>
);

export default InputTitulo;
