import { Form, Input } from 'antd';
import { CDEP_INPUT_DATA_ACERVO } from '~/core/constants/ids/input';

const InputDataAcervo: React.FC = () => {
  return (
    <Form.Item label='Data' name='dataAcervo' rules={[{ required: true, whitespace: true }]}>
      <Input type='text' placeholder='Data' maxLength={50} id={CDEP_INPUT_DATA_ACERVO} />
    </Form.Item>
  );
};

export default InputDataAcervo;
