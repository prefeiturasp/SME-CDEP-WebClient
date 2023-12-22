import { Form, FormItemProps, Input, InputProps } from 'antd';
import { Rule } from 'antd/es/form';
import dayjs from 'dayjs';
import React from 'react';
import { CDEP_INPUT_ANO } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { removerTudoQueNaoEhDigito } from '~/core/utils/functions';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Ano];

type InputAnoProps = {
  tipoAcervo?: TipoAcervo;
  formItemProps?: FormItemProps;
  inputItemProps?: InputProps;
};
const InputAno: React.FC<InputAnoProps> = ({ formItemProps, inputItemProps }) => {
  const anoAtual = dayjs().year();

  let rules: Rule[] = [
    { required: true, whitespace: true },
    ({ getFieldValue }) => ({
      validator() {
        const ano: number = getFieldValue('ano');

        if (ano && ano > anoAtual)
          return Promise.reject(
            'O campo ano não admite anos futuros. Apenas anos atuais e anteriores são permitidos.',
          );

        return Promise.resolve();
      },
    }),
  ];

  if (formItemProps?.rules?.length) {
    rules = [...rules, ...formItemProps.rules];
  }

  return (
    <Form.Item
      label={fieldProps.label}
      name={fieldProps.name}
      rules={rules}
      getValueFromEvent={(e: React.ChangeEvent<HTMLInputElement>) =>
        removerTudoQueNaoEhDigito(`${e?.target?.value}`)
      }
      {...formItemProps}
    >
      <Input
        type='text'
        placeholder={fieldProps.label}
        maxLength={4}
        id={CDEP_INPUT_ANO}
        {...inputItemProps}
      />
    </Form.Item>
  );
};

export default InputAno;
