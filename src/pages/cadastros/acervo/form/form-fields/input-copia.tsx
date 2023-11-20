import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_COPIA } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputCopiaProps = {
  extra?: React.ReactNode;
};
const InputCopia: React.FC<InputCopiaProps> = ({ extra }) => {
  return (
    <Form.Item
      label='Cópia'
      name={AcervoFieldName[FieldAcervoEnum.Copia]}
      rules={[{ whitespace: true }]}
      extra={extra}
    >
      <Input type='text' placeholder='Cópia' maxLength={100} id={CDEP_INPUT_COPIA} />
    </Form.Item>
  );
};

export default InputCopia;
