import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_NOTAS_GERAIS } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputNotasGeraisProps = {
  extra?: React.ReactNode;
};
const InputNotasGerais: React.FC<InputNotasGeraisProps> = ({ extra }) => {
  return (
    <Form.Item
      label='Notas Gerais'
      name={AcervoFieldName[FieldAcervoEnum.NotasGerais]}
      rules={[{ whitespace: true }]}
      extra={extra}
    >
      <Input type='text' placeholder='Notas Gerais' maxLength={500} id={CDEP_INPUT_NOTAS_GERAIS} />
    </Form.Item>
  );
};

export default InputNotasGerais;
