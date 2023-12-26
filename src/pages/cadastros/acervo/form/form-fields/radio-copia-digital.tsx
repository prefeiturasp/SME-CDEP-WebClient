import { Form, Radio as RadioAnt } from 'antd';
import { AbstractCheckboxGroupProps } from 'antd/es/checkbox/Group';
import React, { useEffect, useState } from 'react';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.CopiaDigital];

type RadioCopiaDigitalProps = {
  tipoAcervo?: TipoAcervo;
  extra?: React.ReactNode;
};
const RadioCopiaDigital: React.FC<RadioCopiaDigitalProps> = ({ tipoAcervo, extra }) => {
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

  const validarCampoObrigatorio = () => {
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
    <Form.Item label={fieldProps.label} name={fieldProps.name} rules={[{ required }]} extra={extra}>
      <RadioAnt.Group options={options} />
    </Form.Item>
  );
};

export default RadioCopiaDigital;
