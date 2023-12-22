import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_DURACAO } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Duracao];

type InputDuracaoProps = {
  extra?: React.ReactNode;
};
const InputDuracao: React.FC<InputDuracaoProps> = ({ extra }) => (
  <Form.Item
    label={fieldProps.label}
    name={fieldProps.name}
    rules={[{ whitespace: true }]}
    extra={extra}
  >
    <Input type='text' placeholder={fieldProps.label} maxLength={15} id={CDEP_INPUT_DURACAO} />
  </Form.Item>
);

export default InputDuracao;
