import { Form, Input } from 'antd';
import { CDEP_INPUT_LOCALIZACAO } from '~/core/constants/ids/input';

const InputLocalizacao: React.FC = () => {
  return (
    <Form.Item label='Localização' name='localizacao'>
      <Input type='text' placeholder='Localização' maxLength={100} id={CDEP_INPUT_LOCALIZACAO} />
    </Form.Item>
  );
};

export default InputLocalizacao;
