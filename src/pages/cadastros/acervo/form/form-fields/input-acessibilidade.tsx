import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_ACESSIBILIDADE } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Acessibilidade];

type InputAcessibilidadeProps = {
  extra?: React.ReactNode;
};
const InputAcessibilidade: React.FC<InputAcessibilidadeProps> = ({ extra }) => (
  <Form.Item
    label={fieldProps.label}
    name={fieldProps.name}
    rules={[{ required: false, whitespace: true }]}
    extra={extra}
  >
    <Input
      type='text'
      placeholder={fieldProps.label}
      maxLength={100}
      id={CDEP_INPUT_ACESSIBILIDADE}
    />
  </Form.Item>
);

export default InputAcessibilidade;
