import { Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { CDEP_INPUT_ANO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';

type InputAnoProps = {
  tipoAcervo?: TipoAcervo;
  extra?: React.ReactNode;
};

const InputAno: React.FC<InputAnoProps> = ({ tipoAcervo, extra }) => {
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
    <Form.Item
      label='Ano'
      name={AcervoFieldName[FieldAcervoEnum.Ano]}
      rules={[{ required, whitespace: true }]}
      extra={extra}
    >
      <Input type='text' placeholder='Ano' maxLength={15} id={CDEP_INPUT_ANO} />
    </Form.Item>
  );
};

export default InputAno;
