import { Form, Radio as RadioAnt } from 'antd';
import { AbstractCheckboxGroupProps } from 'antd/es/checkbox/Group';
import React, { useEffect, useState } from 'react';
import { TipoAcervo } from '~/core/enum/tipo-acervo';

type RadioCopiaDigitalProps = {
  tipoAcervo?: TipoAcervo;
};
const RadioCopiaDigital: React.FC<RadioCopiaDigitalProps> = ({ tipoAcervo }) => {
  const [required, setRequired] = useState<boolean>(false);

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

  const validarCampoObrigatorio = async () => {
    switch (tipoAcervo) {
      case TipoAcervo.ArtesGraficas:
        setRequired(true);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    validarCampoObrigatorio();
  }, []);

  return (
    <Form.Item label='Cópia digital' name='copiaDigital' rules={[{ required }]}>
      <RadioAnt.Group options={options} />
    </Form.Item>
  );
};

export default RadioCopiaDigital;
