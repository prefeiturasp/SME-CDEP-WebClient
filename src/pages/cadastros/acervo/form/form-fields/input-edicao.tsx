import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_ANO } from '~/core/constants/ids/input';

const InputEdicao: React.FC = () => {
  return (
    <Form.Item label='Edição' name='edicao' rules={[{ whitespace: true }]}>
      <Input type='text' placeholder='Edição' maxLength={15} id={CDEP_INPUT_ANO} />
    </Form.Item>
  );
};

export default InputEdicao;
