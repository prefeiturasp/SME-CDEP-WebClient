import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_TITULO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputTituloProps = {
  extra?: React.ReactNode;
};
const InputTitulo: React.FC<InputTituloProps> = ({ extra }) => (
  <Form.Item
    label='Título'
    name={AcervoFieldName[FieldAcervoEnum.Titulo]}
    rules={[{ required: true, whitespace: true }]}
    extra={extra}
  >
    <Input type='text' placeholder='Título' maxLength={500} id={CDEP_INPUT_TITULO} />
  </Form.Item>
);

export default InputTitulo;
