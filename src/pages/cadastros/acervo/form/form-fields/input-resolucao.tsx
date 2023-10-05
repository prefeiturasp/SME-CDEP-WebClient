import { Form, Input } from 'antd';
import { CDEP_INPUT_RESOLUCAO } from '~/core/constants/ids/input';

const InputResolucao: React.FC = () => {
  return (
    <Form.Item label='Resolução' name='resolucao' rules={[{ required: true, whitespace: true }]}>
      <Input type='text' placeholder='Resolução' maxLength={15} id={CDEP_INPUT_RESOLUCAO} />
    </Form.Item>
  );
};

export default InputResolucao;
