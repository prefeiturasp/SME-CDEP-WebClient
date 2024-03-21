import { Form, FormItemProps, Input, InputProps } from 'antd';
import { Rule } from 'antd/es/form';
import React from 'react';

type InputEmailProps = {
  inputProps: InputProps;
  formItemProps?: FormItemProps;
  confirmarEmail?: { fieldName: string };
};

const InputEmail: React.FC<InputEmailProps> = ({ inputProps, formItemProps, confirmarEmail }) => {
  const rules: Rule[] = [
    { required: true },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Não é um e-mail válido',
    },
  ];

  if (confirmarEmail?.fieldName) {
    rules.push(({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue(confirmarEmail.fieldName) === value) return Promise.resolve();

        return Promise.reject(new Error('E-mails não correspondem'));
      },
    }));
  }

  return (
    <Form.Item
      label='E-mail'
      name='email'
      dependencies={confirmarEmail ? [confirmarEmail.fieldName] : []}
      rules={rules}
      {...formItemProps}
    >
      <Input
        placeholder='Informe o e-mail'
        autoComplete='off'
        maxLength={100}
        id='INPUT_EMAIL'
        {...inputProps}
      />
    </Form.Item>
  );
};

export default InputEmail;
