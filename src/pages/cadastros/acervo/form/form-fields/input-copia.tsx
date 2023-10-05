import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_COPIA } from '~/core/constants/ids/input';

const InputCopia: React.FC = () => {
  return (
    <Form.Item label='Cópia' name='copia' rules={[{ whitespace: true }]}>
      <Input type='text' placeholder='Cópia' maxLength={100} id={CDEP_INPUT_COPIA} />
    </Form.Item>
  );
};

export default InputCopia;
