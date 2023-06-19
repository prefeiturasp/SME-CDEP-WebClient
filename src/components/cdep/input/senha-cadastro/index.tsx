import { Form, Input } from 'antd';
import { Rule } from 'antd/es/form';
import React from 'react';

type SenhaCadastroProps = {
  label: string;
  name: string;
  confirmarSenha?: boolean;
};

const SenhaCadastro: React.FC<SenhaCadastroProps> = ({ label, name, confirmarSenha }) => {
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
      label={label}
      name={name}
      rules={rules}
      dependencies={confirmarSenha ? ['senha'] : []}
    >
      <Input.Password autoComplete='off' placeholder='Informe a senha' maxLength={12} />
    </Form.Item>
  );
};

export default SenhaCadastro;
