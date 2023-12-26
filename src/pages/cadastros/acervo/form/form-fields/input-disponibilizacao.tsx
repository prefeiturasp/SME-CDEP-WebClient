import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_DISPONIBILIZACAO } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Disponibilizacao];

type InputDisponibilizacaoProps = {
  extra?: React.ReactNode;
};
const InputDisponibilizacao: React.FC<InputDisponibilizacaoProps> = ({ extra }) => (
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
      id={CDEP_INPUT_DISPONIBILIZACAO}
    />
  </Form.Item>
);

export default InputDisponibilizacao;
