import { Form, Input, InputProps } from 'antd';
import React from 'react';

const InputTelefone: React.FC<InputProps> = ({ ...rest }) => {
  const removerTudoQueNaoEhDigito = (value: any) => `${value}`.replace(/\D/g, '');

  const maskTelefone = (value: string | number | undefined) =>
    `${value}`.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2');

  const getValueFromEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = removerTudoQueNaoEhDigito(e?.target?.value);
    return value ? maskTelefone(value) : value;
  };

  return (
    <Form.Item
      label='Telefone'
      name='telefone'
      getValueFromEvent={getValueFromEvent}
      rules={[
        { required: true },
        {
          message:
            'Telefone inválido, você deve digitar o DDD com dois dígitos e o telefone com 8 ou 9 dígitos',
          validator: (_, value) => {
            if (!value) return Promise.resolve();

            const regex = /(?=\s(9)).*/;
            const comecaComNove = regex.test(value);

            const ehCelular = comecaComNove && value?.length === 15;
            const ehTelefone = !comecaComNove && value?.length === 14;

            if (ehCelular || ehTelefone) return Promise.resolve();

            return Promise.reject();
          },
        },
      ]}
    >
      <Input placeholder='(XX) XXXXX-XXXX' maxLength={15} {...rest} />
    </Form.Item>
  );
};

export default InputTelefone;
