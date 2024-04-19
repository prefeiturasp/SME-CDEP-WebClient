import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_RESOLUCAO } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Resolucao];

type InputResolucaoProps = {
  extra?: React.ReactNode;
};
const InputResolucao: React.FC<InputResolucaoProps> = ({ extra }) => (
  <Form.Item
    label={fieldProps.label}
    name={fieldProps.name}
    rules={[{ required: true, whitespace: true }]}
    extra={extra}
  >
    <Input type='text' placeholder={fieldProps.label} maxLength={15} id={CDEP_INPUT_RESOLUCAO} />
  </Form.Item>
);

export default InputResolucao;
