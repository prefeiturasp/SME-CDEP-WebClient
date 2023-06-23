import { Form, Input } from 'antd';
import { FormItemProps, Rule } from 'antd/es/form';
import { PasswordProps } from 'antd/es/input';
import React from 'react';

type SenhaCadastroProps = {
  // label: string;
  // name: string;
  confirmarSenha?: boolean;
  // id: string;
  // required?: boolean;
  // styleFormItem?: React.CSSProperties;
  // disabled?: boolean;

  inputProps: PasswordProps;
  formItemProps?: FormItemProps;
};

const SenhaCadastro: React.FC<SenhaCadastroProps> = ({
  // label,
  // name,
  confirmarSenha,
  inputProps,
  formItemProps,
  // id,
  // required = true,
  // disabled = false,
  // styleFormItem,
}) => {
  const getValueFromEvent = (e: React.ChangeEvent<HTMLInputElement>) =>
    `${e?.target?.value}`.trim();

  const rules: Rule[] = [
    { required: true, min: 8, max: 12 },
    {
      pattern: /^(?=.*[a-z]{1})/,
      message: 'Deve conter uma letra minúscula',
    },
    {
      pattern: /(?=.*[A-Z]{1})/,
      message: 'Deve conter uma letra maiúscula',
    },
    {
      pattern: /(?=.*\d|\W)/,
      message: 'Deve conter um algarismo (número) ou um símbolo (caractere especial)',
    },
    {
      pattern: /^[^À-ú]+$/,
      message: 'Não pode conter caracteres acentuados',
    },
  ];

  if (confirmarSenha) {
    rules.push(({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('senha') === value) return Promise.resolve();

        return Promise.reject(new Error('Senhas não correspondem'));
      },
    }));
  }

  return (
    <Form.Item
      getValueFromEvent={getValueFromEvent}
      rules={rules}
      dependencies={confirmarSenha ? ['senha'] : []}
      label='Senha'
      name='senha'
      {...formItemProps}
    >
      <Input.Password
        autoComplete='off'
        placeholder='Informe a senha'
        maxLength={12}
        id='INPUT_SENHA'
        {...inputProps}
      />
    </Form.Item>
  );
};

export default SenhaCadastro;
