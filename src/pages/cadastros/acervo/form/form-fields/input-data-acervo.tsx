import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_DATA_ACERVO } from '~/core/constants/ids/input';
import { PropsByFieldAcervoEnum, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.DataAcervo];

type InputDataAcervoProps = {
  extra?: React.ReactNode;
};
const InputDataAcervo: React.FC<InputDataAcervoProps> = ({ extra }) => {
  return (
    <Form.Item
      label={fieldProps.label}
      name={fieldProps.name}
      rules={[{ required: true, whitespace: true }]}
      extra={extra}
    >
      <Input
        type='text'
        placeholder={fieldProps.label}
        maxLength={50}
        id={CDEP_INPUT_DATA_ACERVO}
      />
    </Form.Item>
  );
};

export default InputDataAcervo;
