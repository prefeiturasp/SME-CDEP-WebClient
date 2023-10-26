import { Form, Input } from 'antd';
import { CDEP_INPUT_NOTAS_GERAIS } from '~/core/constants/ids/input';

const InputNotasGerais: React.FC = () => {
  return (
    <Form.Item label='Notas Gerais' name='notasGerais' rules={[{ whitespace: true }]}>
      <Input type='text' placeholder='Notas Gerais' maxLength={500} id={CDEP_INPUT_NOTAS_GERAIS} />
    </Form.Item>
  );
};

export default InputNotasGerais;
