import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_NOTAS_GERAIS } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.NotasGerais];

type InputNotasGeraisProps = {
  extra?: React.ReactNode;
};
const InputNotasGerais: React.FC<InputNotasGeraisProps> = ({ extra }) => (
  <Form.Item
    label={fieldProps.label}
    name={fieldProps.name}
    rules={[{ whitespace: true }]}
    extra={extra}
  >
    <Input
      type='text'
      placeholder={fieldProps.label}
      maxLength={500}
      id={CDEP_INPUT_NOTAS_GERAIS}
    />
  </Form.Item>
);

export default InputNotasGerais;
