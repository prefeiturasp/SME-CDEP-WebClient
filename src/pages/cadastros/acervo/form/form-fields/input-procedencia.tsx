import { Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { CDEP_INPUT_PROCEDENCIA } from '~/core/constants/ids/input';
import { TipoAcervo } from '~/core/enum/tipo-acervo';

type InputProcedenciaProps = {
  tipoAcervo?: TipoAcervo;
};

const InputProcedencia: React.FC<InputProcedenciaProps> = ({ tipoAcervo }) => {
  const [required, setRequired] = useState<boolean>(true);

  const validarCampoObrigatorio = () => {
    switch (tipoAcervo) {
      case TipoAcervo.Audiovisual:
        setRequired(false);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    validarCampoObrigatorio();
  }, []);

  return (
    <Form.Item label='Procedência' name='procedencia' rules={[{ required, whitespace: true }]}>
      <Input type='text' placeholder='Procedência' maxLength={200} id={CDEP_INPUT_PROCEDENCIA} />
    </Form.Item>
  );
};

export default InputProcedencia;
