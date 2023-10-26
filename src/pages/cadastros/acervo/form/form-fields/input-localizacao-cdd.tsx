import { Form, Input } from 'antd';
import { CDEP_INPUT_LOCALIZACAO_CDD } from '~/core/constants/ids/input';

const InputLocalizacaoCDD: React.FC = () => {
  return (
    <Form.Item label='Localização CDD' name='localizacaoCDD' rules={[{ required: true }]}>
      <Input
        type='text'
        placeholder='Localização CDD'
        maxLength={50}
        id={CDEP_INPUT_LOCALIZACAO_CDD}
      />
    </Form.Item>
  );
};

export default InputLocalizacaoCDD;
