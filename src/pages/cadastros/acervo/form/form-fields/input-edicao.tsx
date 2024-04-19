import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_EDICAO } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Edicao];

type InputEdicaoProps = {
  extra?: React.ReactNode;
};
const InputEdicao: React.FC<InputEdicaoProps> = ({ extra }) => (
  <Form.Item
    label={fieldProps.label}
    name={fieldProps.name}
    rules={[{ whitespace: true }]}
    extra={extra}
  >
    <Input type='text' placeholder={fieldProps.label} maxLength={30} id={CDEP_INPUT_EDICAO} />
  </Form.Item>
);

export default InputEdicao;
