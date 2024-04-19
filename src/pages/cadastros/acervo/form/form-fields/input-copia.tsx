import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_COPIA } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Copia];

type InputCopiaProps = {
  extra?: React.ReactNode;
};
const InputCopia: React.FC<InputCopiaProps> = ({ extra }) => (
  <Form.Item
    label={fieldProps.label}
    name={fieldProps.name}
    rules={[{ whitespace: true }]}
    extra={extra}
  >
    <Input type='text' placeholder={fieldProps.label} maxLength={100} id={CDEP_INPUT_COPIA} />
  </Form.Item>
);

export default InputCopia;
