import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_RESOLUCAO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputResolucaoProps = {
  extra?: React.ReactNode;
};
const InputResolucao: React.FC<InputResolucaoProps> = ({ extra }) => {
  return (
    <Form.Item
      label='Resolução'
      name={AcervoFieldName[FieldAcervoEnum.Resolucao]}
      rules={[{ required: true, whitespace: true }]}
      extra={extra}
    >
      <Input type='text' placeholder='Resolução' maxLength={15} id={CDEP_INPUT_RESOLUCAO} />
    </Form.Item>
  );
};

export default InputResolucao;
