import { Form, Input } from 'antd';
import { CDEP_INPUT_SUBTITULO } from '~/core/constants/ids/input';

const InputSubtitulo: React.FC = () => {
  return (
    <Form.Item label='Subtítulo' name='subTitulo' rules={[{ whitespace: true }]}>
      <Input type='text' placeholder='Subtítulo' maxLength={500} id={CDEP_INPUT_SUBTITULO} />
    </Form.Item>
  );
};

export default InputSubtitulo;
