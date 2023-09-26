import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_TOMBO } from '~/core/constants/ids/input';
import { TipoAcervo, TipoAcervoSuffix } from '~/core/enum/tipo-acervo';

type InputTomboProps = {
  tipoAcervo: TipoAcervo;
};

const InputTombo: React.FC<InputTomboProps> = ({ tipoAcervo }) => {
  return (
    <Form.Item label='Tombo' name='codigo' rules={[{ required: true, whitespace: true }]}>
      <Input
        type='text'
        placeholder='Tombo'
        maxLength={13}
        id={CDEP_INPUT_TOMBO}
        addonAfter={TipoAcervoSuffix[tipoAcervo]}
      />
    </Form.Item>
  );
};

export default InputTombo;
