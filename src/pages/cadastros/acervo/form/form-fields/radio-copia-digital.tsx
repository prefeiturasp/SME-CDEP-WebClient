import { Form, Radio as RadioAnt } from 'antd';
import { AbstractCheckboxGroupProps } from 'antd/es/checkbox/Group';

const RadioCopiaDigital: React.FC = () => {
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
    <Form.Item label='Cópia digital' name='copiaDigital'>
      <RadioAnt.Group options={options} />
    </Form.Item>
  );
};

export default RadioCopiaDigital;
