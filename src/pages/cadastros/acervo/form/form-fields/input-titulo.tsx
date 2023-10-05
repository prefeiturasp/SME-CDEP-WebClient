import { Form, Input } from 'antd';
import { CDEP_INPUT_TITULO } from '~/core/constants/ids/input';

const InputTitulo: React.FC = () => {
  return (
    <Form.Item label='Título' name='titulo' rules={[{ required: true, whitespace: true }]}>
      <Input type='text' placeholder='Título' maxLength={500} id={CDEP_INPUT_TITULO} />
    </Form.Item>
  );
};

export default InputTitulo;
