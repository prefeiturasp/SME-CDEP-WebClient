import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_TIPO_ANEXO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputTipoAnexoProps = {
  extra?: React.ReactNode;
};
const InputTipoAnexo: React.FC<InputTipoAnexoProps> = ({ extra }) => {
  return (
    <Form.Item
      label='Tipo de anexo'
      name={AcervoFieldName[FieldAcervoEnum.TipoDeAnexo]}
      extra={extra}
    >
      <Input type='text' placeholder='Tipo de Anexo' maxLength={50} id={CDEP_INPUT_TIPO_ANEXO} />
    </Form.Item>
  );
};

export default InputTipoAnexo;
