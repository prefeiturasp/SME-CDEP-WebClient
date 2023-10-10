import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_DURACAO } from '~/core/constants/ids/input';

const InputDuracao: React.FC = () => {
  return (
    <Form.Item label='Duração' name='duracao' rules={[{ whitespace: true }]}>
      <Input type='text' placeholder='Duração' maxLength={15} id={CDEP_INPUT_DURACAO} />
    </Form.Item>
  );
};

export default InputDuracao;
