import { Form, Input } from 'antd';
import { CDEP_INPUT_PROCEDENCIA } from '~/core/constants/ids/input';

const InputProcedencia: React.FC = () => {
  return (
    <Form.Item
      label='Procedência'
      name='procedencia'
      rules={[{ required: true, whitespace: true }]}
    >
      <Input type='text' placeholder='Procedência' maxLength={200} id={CDEP_INPUT_PROCEDENCIA} />
    </Form.Item>
  );
};

export default InputProcedencia;
