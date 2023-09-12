import { Form, Radio as RadioAnt } from 'antd';
import { AbstractCheckboxGroupProps } from 'antd/es/checkbox/Group';

const RadioAutorizacaoUsoImagem: React.FC = () => {
  const options: AbstractCheckboxGroupProps['options'] = [
    {
      label: 'Sim',
      value: true,
    },
    {
      label: 'Não',
      value: false,
    },
  ];
  return (
    <Form.Item label='Autorização do uso de imagem' name='permiteUsoImagem'>
      <RadioAnt.Group options={options} />
    </Form.Item>
  );
};

export default RadioAutorizacaoUsoImagem;
