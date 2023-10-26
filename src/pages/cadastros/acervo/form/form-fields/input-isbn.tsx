import { Form, Input } from 'antd';
import { CDEP_INPUT_ISBN } from '~/core/constants/ids/input';

const InputISBN: React.FC = () => {
  return (
    <Form.Item label='ISBN' name='isbn' rules={[{ whitespace: true }]}>
      <Input type='text' placeholder='ISBN' maxLength={50} id={CDEP_INPUT_ISBN} />
    </Form.Item>
  );
};

export default InputISBN;
