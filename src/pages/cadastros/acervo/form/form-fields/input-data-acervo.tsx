import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_DATA_ACERVO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputDataAcervoProps = {
  extra?: React.ReactNode;
};
const InputDataAcervo: React.FC<InputDataAcervoProps> = ({ extra }) => {
  return (
    <Form.Item
      label='Data'
      name={AcervoFieldName[FieldAcervoEnum.DataAcervo]}
      rules={[{ required: true, whitespace: true }]}
      extra={extra}
    >
      <Input type='text' placeholder='Data' maxLength={50} id={CDEP_INPUT_DATA_ACERVO} />
    </Form.Item>
  );
};

export default InputDataAcervo;
