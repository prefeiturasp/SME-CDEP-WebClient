import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_DISPONIBILIZACAO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputDisponibilizacaoProps = {
  extra?: React.ReactNode;
};
const InputDisponibilizacao: React.FC<InputDisponibilizacaoProps> = ({ extra }) => {
  return (
    <Form.Item
      label='Disponibilização'
      name={AcervoFieldName[FieldAcervoEnum.Disponibilizacao]}
      rules={[{ required: false, whitespace: true }]}
      extra={extra}
    >
      <Input
        type='text'
        placeholder='Disponibilização'
        maxLength={100}
        id={CDEP_INPUT_DISPONIBILIZACAO}
      />
    </Form.Item>
  );
};

export default InputDisponibilizacao;
