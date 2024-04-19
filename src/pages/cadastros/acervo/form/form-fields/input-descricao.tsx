import { Form, Input } from 'antd';
import { CDEP_INPUT_DESCRICAO } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Descricao];

const InputDescricao: React.FC = () => (
  <Form.Item
    label={fieldProps.label}
    name={fieldProps.name}
    rules={[{ required: true, whitespace: true }]}
  >
    <Input type='text' placeholder={fieldProps.label} id={CDEP_INPUT_DESCRICAO} />
  </Form.Item>
);

export default InputDescricao;
