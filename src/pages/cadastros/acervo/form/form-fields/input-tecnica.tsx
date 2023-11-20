import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_TECNICA } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputTecnicaProps = {
  extra?: React.ReactNode;
};
const InputTecnica: React.FC<InputTecnicaProps> = ({ extra }) => {
  return (
    <Form.Item label='Técnica' name={AcervoFieldName[FieldAcervoEnum.Tecnica]} extra={extra}>
      <Input type='text' placeholder='Técnica' maxLength={100} id={CDEP_INPUT_TECNICA} />
    </Form.Item>
  );
};

export default InputTecnica;
