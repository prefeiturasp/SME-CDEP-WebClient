import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_ANO } from '~/core/constants/ids/input';

const InputAno: React.FC = () => {
  return (
    <Form.Item label='Ano' name='ano' rules={[{ whitespace: true }]}>
      <Input type='text' placeholder='Ano' maxLength={15} id={CDEP_INPUT_ANO} />
    </Form.Item>
  );
};

export default InputAno;
