import { Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { CDEP_INPUT_ANO } from '~/core/constants/ids/input';
import { TipoAcervo } from '~/core/enum/tipo-acervo';

type InputAnoProps = {
  tipoAcervo?: TipoAcervo;
};

const InputAno: React.FC<InputAnoProps> = ({ tipoAcervo }) => {
  const [required, setRequired] = useState<boolean>(false);

  const validarCampoObrigatorio = () => {
    switch (tipoAcervo) {
      case TipoAcervo.Bibliografico:
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
    <Form.Item label='Ano' name='ano' rules={[{ required, whitespace: true }]}>
      <Input type='text' placeholder='Ano' maxLength={15} id={CDEP_INPUT_ANO} />
    </Form.Item>
  );
};

export default InputAno;
