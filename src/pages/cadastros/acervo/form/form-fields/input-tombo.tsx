import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_TOMBO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo, TipoAcervoSuffix } from '~/core/enum/tipo-acervo';

type InputTomboProps = {
  tipoAcervo: TipoAcervo;
  extra?: React.ReactNode;
};

const InputTombo: React.FC<InputTomboProps> = ({ tipoAcervo, extra }) => {
  return (
    <Form.Item
      label='Tombo'
      name={AcervoFieldName[FieldAcervoEnum.Tombo]}
      rules={[{ required: true, whitespace: true }]}
      extra={extra}
    >
      <Input
        type='text'
        placeholder='Tombo'
        maxLength={12}
        id={CDEP_INPUT_TOMBO}
        addonAfter={TipoAcervoSuffix[tipoAcervo]}
      />
    </Form.Item>
  );
};

export default InputTombo;
