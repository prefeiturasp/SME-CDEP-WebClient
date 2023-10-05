import { Form, Radio as RadioAnt } from 'antd';
import { AbstractCheckboxGroupProps } from 'antd/es/checkbox/Group';
import React, { useEffect, useState } from 'react';
import { TipoAcervo } from '~/core/enum/tipo-acervo';

type RadioAutorizacaoUsoImagemProps = {
  tipoAcervo?: TipoAcervo;
};
const RadioAutorizacaoUsoImagem: React.FC<RadioAutorizacaoUsoImagemProps> = ({ tipoAcervo }) => {
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
    <Form.Item label='Autorização do uso de imagem' name='permiteUsoImagem' rules={[{ required }]}>
      <RadioAnt.Group options={options} />
    </Form.Item>
  );
};

export default RadioAutorizacaoUsoImagem;
