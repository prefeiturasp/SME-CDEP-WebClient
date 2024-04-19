import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_LOCALIZACAO_CDD } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.LocalizacaoCDD];

type InputLocalizacaoCDDProps = {
  extra?: React.ReactNode;
};
const InputLocalizacaoCDD: React.FC<InputLocalizacaoCDDProps> = ({ extra }) => (
  <Form.Item
    label={fieldProps.label}
    name={fieldProps.name}
    rules={[{ required: true }]}
    extra={extra}
  >
    <Input
      type='text'
      placeholder={fieldProps.label}
      maxLength={50}
      id={CDEP_INPUT_LOCALIZACAO_CDD}
    />
  </Form.Item>
);

export default InputLocalizacaoCDD;
