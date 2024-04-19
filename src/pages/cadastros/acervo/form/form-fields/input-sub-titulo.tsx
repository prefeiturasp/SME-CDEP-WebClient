import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_SUBTITULO } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Subtitulo];

type InputSubtituloProps = {
  extra?: React.ReactNode;
};
const InputSubtitulo: React.FC<InputSubtituloProps> = ({ extra }) => (
  <Form.Item
    label={fieldProps.label}
    name={fieldProps.name}
    rules={[{ whitespace: true }]}
    extra={extra}
  >
    <Input type='text' placeholder={fieldProps.label} maxLength={500} id={CDEP_INPUT_SUBTITULO} />
  </Form.Item>
);

export default InputSubtitulo;
