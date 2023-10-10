import { Form, Input } from 'antd';
import { CDEP_INPUT_TIPO_ANEXO } from '~/core/constants/ids/input';

const InputTipoAnexo: React.FC = () => {
  return (
    <Form.Item label='Tipo de Anexo' name='tipoAnexo'>
      <Input type='text' placeholder='Tipo de Anexo' maxLength={50} id={CDEP_INPUT_TIPO_ANEXO} />
    </Form.Item>
  );
};

export default InputTipoAnexo;
