import { Form, Input } from 'antd';
import { CDEP_INPUT_TOMBO } from '~/core/constants/ids/input';

const InputTombo: React.FC = () => {
  return (
    <Form.Item label='Tombo' name='codigo' rules={[{ required: true, whitespace: true }]}>
      <Input type='text' placeholder='Tombo' maxLength={15} id={CDEP_INPUT_TOMBO} />
    </Form.Item>
  );
};

export default InputTombo;
