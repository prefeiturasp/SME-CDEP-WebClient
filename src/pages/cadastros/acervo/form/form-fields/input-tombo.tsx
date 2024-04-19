import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_TOMBO } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo, TipoAcervoSuffix } from '~/core/enum/tipo-acervo';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Tombo];

type InputTomboProps = {
  tipoAcervo: TipoAcervo;
  extra?: React.ReactNode;
};

const InputTombo: React.FC<InputTomboProps> = ({ tipoAcervo, extra }) => (
  <Form.Item
    label={fieldProps.label}
    name={fieldProps.name}
    rules={[{ required: true, whitespace: true }]}
    extra={extra}
  >
    <Input
      type='text'
      placeholder={fieldProps.label}
      maxLength={12}
      id={CDEP_INPUT_TOMBO}
      addonAfter={TipoAcervoSuffix[tipoAcervo]}
    />
  </Form.Item>
);

export default InputTombo;
