import { Form, Input } from 'antd';
import { CDEP_INPUT_DESCRICAO } from '~/core/constants/ids/input';

const InputDescricao: React.FC = () => {
  return (
    <Form.Item label='Descrição' name='descricao' rules={[{ required: true, whitespace: true }]}>
      <Input type='text' placeholder='Descrição' id={CDEP_INPUT_DESCRICAO} />
    </Form.Item>
  );
};

export default InputDescricao;
