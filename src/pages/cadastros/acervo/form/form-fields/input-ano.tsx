import { Form, FormItemProps, Input, InputProps } from 'antd';
import { Rule } from 'antd/es/form';
import React from 'react';
import { CDEP_INPUT_ANO } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Ano];

type InputAnoProps = {
  tipoAcervo?: TipoAcervo;
  formItemProps?: FormItemProps;
  inputItemProps?: InputProps;
};
const InputAno: React.FC<InputAnoProps> = ({ formItemProps, inputItemProps }) => {
  let rules: Rule[] = [{ required: true, whitespace: true }];

  if (formItemProps?.rules?.length) {
    rules = [...rules, ...formItemProps.rules];
  }

  return (
    <Form.Item label={fieldProps.label} name={fieldProps.name} rules={rules} {...formItemProps}>
      <Input
        type='text'
        placeholder={fieldProps.label}
        maxLength={7}
        id={CDEP_INPUT_ANO}
        {...inputItemProps}
      />
    </Form.Item>
  );
};

export default InputAno;
