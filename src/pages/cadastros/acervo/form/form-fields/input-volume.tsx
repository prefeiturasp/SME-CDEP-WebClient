import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_VOLUME } from '~/core/constants/ids/input';

const InputVolume: React.FC = () => {
  return (
    <Form.Item label='Volume' name='volume' >
      <Input type='text' placeholder='Volume' maxLength={15} id={CDEP_INPUT_VOLUME} />
    </Form.Item>
  );
};

export default InputVolume;
