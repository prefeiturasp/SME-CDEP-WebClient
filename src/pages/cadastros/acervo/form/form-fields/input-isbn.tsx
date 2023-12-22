import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_ISBN } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.ISBN];

type InputISBNProps = {
  extra?: React.ReactNode;
};
const InputISBN: React.FC<InputISBNProps> = ({ extra }) => (
  <Form.Item
    label={fieldProps.label}
    name={fieldProps.name}
    rules={[{ whitespace: true }]}
    extra={extra}
  >
    <Input type='text' placeholder={fieldProps.label} maxLength={50} id={CDEP_INPUT_ISBN} />
  </Form.Item>
);

export default InputISBN;
