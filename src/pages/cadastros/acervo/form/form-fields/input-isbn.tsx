import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_ISBN } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputISBNProps = {
  extra?: React.ReactNode;
};
const InputISBN: React.FC<InputISBNProps> = ({ extra }) => {
  return (
    <Form.Item
      label='ISBN'
      name={AcervoFieldName[FieldAcervoEnum.ISBN]}
      rules={[{ whitespace: true }]}
      extra={extra}
    >
      <Input type='text' placeholder='ISBN' maxLength={50} id={CDEP_INPUT_ISBN} />
    </Form.Item>
  );
};

export default InputISBN;
