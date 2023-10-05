import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_ACESSIBILIDADE } from '~/core/constants/ids/input';

const InputAcessibilidade: React.FC = () => {
  return (
    <Form.Item
      label='Acessibilidade'
      name='acessibilidade'
      rules={[{ required: false, whitespace: true }]}
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
