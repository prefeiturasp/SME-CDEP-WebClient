import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_LOCALIZACAO } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Localizacao];

type InputLocalizacaoProps = {
  extra?: React.ReactNode;
};
const InputLocalizacao: React.FC<InputLocalizacaoProps> = ({ extra }) => (
  <Form.Item label={fieldProps.label} name={fieldProps.name} extra={extra}>
    <Input type='text' placeholder={fieldProps.label} maxLength={100} id={CDEP_INPUT_LOCALIZACAO} />
  </Form.Item>
);

export default InputLocalizacao;
