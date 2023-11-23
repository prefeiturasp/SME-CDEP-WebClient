import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_LOCALIZACAO_PHA } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputLocalizacaoPHAProps = {
  extra?: React.ReactNode;
};
const InputLocalizacaoPHA: React.FC<InputLocalizacaoPHAProps> = ({ extra }) => {
  return (
    <Form.Item
      label='Localização PHA'
      name={AcervoFieldName[FieldAcervoEnum.LocalizacaoPHA]}
      rules={[{ required: true }]}
      extra={extra}
    >
      <Input
        type='text'
        placeholder='Localização PHA'
        maxLength={50}
        id={CDEP_INPUT_LOCALIZACAO_PHA}
      />
    </Form.Item>
  );
};

export default InputLocalizacaoPHA;
