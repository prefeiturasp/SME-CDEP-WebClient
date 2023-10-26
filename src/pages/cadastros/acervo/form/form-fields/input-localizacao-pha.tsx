import { Form, Input } from 'antd';
import { CDEP_INPUT_LOCALIZACAO_PHA } from '~/core/constants/ids/input';

const InputLocalizacaoPHA: React.FC = () => {
  return (
    <Form.Item label='Localização PHA' name='localizacaoPHA' rules={[{ required: true }]}>
      <Input
        type='text'
        placeholder='Localização PHA'
        maxLength={50}
        id={CDEP_INPUT_LOCALIZACAO_PHA}
      />
    </Form.Item>
  );
};

export default InputLocalizacaoPHA;
