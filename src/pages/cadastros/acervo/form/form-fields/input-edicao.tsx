import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_ANO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputEdicaoProps = {
  extra?: React.ReactNode;
};
const InputEdicao: React.FC<InputEdicaoProps> = ({ extra }) => {
  return (
    <Form.Item
      label='Edição'
      name={AcervoFieldName[FieldAcervoEnum.Edicao]}
      rules={[{ whitespace: true }]}
      extra={extra}
    >
      <Input type='text' placeholder='Edição' maxLength={15} id={CDEP_INPUT_ANO} />
    </Form.Item>
  );
};

export default InputEdicao;
