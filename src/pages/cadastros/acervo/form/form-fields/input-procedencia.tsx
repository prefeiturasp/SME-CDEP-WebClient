import { Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { CDEP_INPUT_PROCEDENCIA } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';

type InputProcedenciaProps = {
  tipoAcervo?: TipoAcervo;
  extra?: React.ReactNode;
};
const InputProcedencia: React.FC<InputProcedenciaProps> = ({ tipoAcervo, extra }) => {
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
    <Form.Item
      label='Procedência'
      name={AcervoFieldName[FieldAcervoEnum.Procedencia]}
      rules={[{ required, whitespace: true }]}
      extra={extra}
    >
      <Input type='text' placeholder='Procedência' maxLength={200} id={CDEP_INPUT_PROCEDENCIA} />
    </Form.Item>
  );
};

export default InputProcedencia;
