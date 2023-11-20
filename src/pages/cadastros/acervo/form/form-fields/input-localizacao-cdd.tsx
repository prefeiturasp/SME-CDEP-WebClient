import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_LOCALIZACAO_CDD } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputLocalizacaoCDDProps = {
  extra?: React.ReactNode;
};
const InputLocalizacaoCDD: React.FC<InputLocalizacaoCDDProps> = ({ extra }) => {
  return (
    <Form.Item
      label='Localização CDD'
      name={AcervoFieldName[FieldAcervoEnum.LocalizacaoCDD]}
      rules={[{ required: true }]}
      extra={extra}
    >
      <Input
        type='text'
        placeholder='Localização CDD'
        maxLength={50}
        id={CDEP_INPUT_LOCALIZACAO_CDD}
      />
    </Form.Item>
  );
};

export default InputLocalizacaoCDD;
