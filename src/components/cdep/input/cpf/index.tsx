import { Form, Input, InputProps } from 'antd';
import React from 'react';

const InputCPF: React.FC<InputProps> = ({ ...rest }) => {
  const removerTudoQueNaoEhDigito = (value: any) => `${value}`.replace(/\D/g, '');

  const formatterCPFMask = (value: string | number | undefined) =>
    `${value}`
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');

  const getValueFromEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = removerTudoQueNaoEhDigito(e?.target?.value);
    return value ? formatterCPFMask(value) : value;
  };

  return (
    <Form.Item
      label='CPF'
      name='cpf'
      getValueFromEvent={getValueFromEvent}
      rules={[
        { required: true },
        {
          message: 'Deve conter 11 caracteres',
          validator: (_, value) => {
            const valorValidar = removerTudoQueNaoEhDigito(value);

            if (!valorValidar) return Promise.resolve();

            if (/^[0-9]{11}/.test(valorValidar)) return Promise.resolve();

            return Promise.reject();
          },
        },
      ]}
    >
      <Input placeholder='Informe o CPF' {...rest} />
    </Form.Item>
  );
};

export default InputCPF;
