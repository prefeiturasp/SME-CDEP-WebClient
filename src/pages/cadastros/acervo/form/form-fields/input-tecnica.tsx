import { Form, Input } from 'antd';
import { CDEP_INPUT_TECNICA } from '~/core/constants/ids/input';

const InputTecnica: React.FC = () => {
  return (
    <Form.Item label='Técnica' name='tecnica'>
      <Input type='text' placeholder='Técnica' maxLength={100} id={CDEP_INPUT_TECNICA} />
    </Form.Item>
  );
};

export default InputTecnica;
