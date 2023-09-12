import { Form, Input } from 'antd';
import { CDEP_INPUT_TAMANHO_ARQUIVO } from '~/core/constants/ids/input';

const InputTamanhoArquivo: React.FC = () => {
  return (
    <Form.Item
      label='Tamanho do arquivo'
      name='tamanhoArquivo'
      rules={[{ required: true, whitespace: true }]}
    >
      <Input
        type='text'
        placeholder='Tamanho do arquivo'
        maxLength={15}
        id={CDEP_INPUT_TAMANHO_ARQUIVO}
      />
    </Form.Item>
  );
};

export default InputTamanhoArquivo;
