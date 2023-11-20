import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_DURACAO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputDuracaoProps = {
  extra?: React.ReactNode;
};
const InputDuracao: React.FC<InputDuracaoProps> = ({ extra }) => {
  return (
    <Form.Item
      label='Duração'
      name={AcervoFieldName[FieldAcervoEnum.Duracao]}
      rules={[{ whitespace: true }]}
      extra={extra}
    >
      <Input type='text' placeholder='Duração' maxLength={15} id={CDEP_INPUT_DURACAO} />
    </Form.Item>
  );
};

export default InputDuracao;
