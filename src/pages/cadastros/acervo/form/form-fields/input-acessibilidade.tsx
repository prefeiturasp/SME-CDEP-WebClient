import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_ACESSIBILIDADE } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputAcessibilidadeProps = {
  extra?: React.ReactNode;
};
const InputAcessibilidade: React.FC<InputAcessibilidadeProps> = ({ extra }) => {
  return (
    <Form.Item
      label='Acessibilidade'
      name={AcervoFieldName[FieldAcervoEnum.Acessibilidade]}
      rules={[{ required: false, whitespace: true }]}
      extra={extra}
    >
      <Input
        type='text'
        placeholder='Acessibilidade'
        maxLength={100}
        id={CDEP_INPUT_ACESSIBILIDADE}
      />
    </Form.Item>
  );
};

export default InputAcessibilidade;
