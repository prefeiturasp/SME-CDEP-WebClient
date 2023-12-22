import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_LOCALIZACAO_PHA } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.LocalizacaoPHA];

type InputLocalizacaoPHAProps = {
  extra?: React.ReactNode;
};
const InputLocalizacaoPHA: React.FC<InputLocalizacaoPHAProps> = ({ extra }) => (
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
      id={CDEP_INPUT_LOCALIZACAO_PHA}
    />
  </Form.Item>
);

export default InputLocalizacaoPHA;
