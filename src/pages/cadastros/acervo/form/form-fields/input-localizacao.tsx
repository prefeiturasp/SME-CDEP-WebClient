import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_LOCALIZACAO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputLocalizacaoProps = {
  extra?: React.ReactNode;
};
const InputLocalizacao: React.FC<InputLocalizacaoProps> = ({ extra }) => {
  return (
    <Form.Item
      label='Localização'
      name={AcervoFieldName[FieldAcervoEnum.Localizacao]}
      extra={extra}
    >
      <Input type='text' placeholder='Localização' maxLength={100} id={CDEP_INPUT_LOCALIZACAO} />
    </Form.Item>
  );
};

export default InputLocalizacao;
