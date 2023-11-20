import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_SUBTITULO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputSubtituloProps = {
  extra?: React.ReactNode;
};
const InputSubtitulo: React.FC<InputSubtituloProps> = ({ extra }) => {
  return (
    <Form.Item
      label='Subtítulo'
      name={AcervoFieldName[FieldAcervoEnum.Subtitulo]}
      rules={[{ whitespace: true }]}
      extra={extra}
    >
      <Input type='text' placeholder='Subtítulo' maxLength={500} id={CDEP_INPUT_SUBTITULO} />
    </Form.Item>
  );
};

export default InputSubtitulo;
