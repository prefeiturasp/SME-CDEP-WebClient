import React from 'react';
import { Form, FormItemProps, Input, InputProps } from 'antd';
import { removerTudoQueNaoEhDigito } from '~/core/utils/functions';

type InputCEPProps = {
  inputProps: InputProps;
  formItemProps?: FormItemProps;
};

const InputCEP: React.FC<InputCEPProps> = ({ inputProps, formItemProps }) => {
  const maskCEP = (value: string | number | undefined) =>
    `${value}`.replace(/^(\d{5})(\d{3})+?$/, '$1-$2');

  const getValueFromEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = removerTudoQueNaoEhDigito(e?.target?.value);
    return value ? maskCEP(value) : value;
  };

  return (
    <Form.Item
      name='cep'
      label='CEP'
      {...formItemProps}
      getValueFromEvent={getValueFromEvent}
      rules={[
        { required: true },
        {
          message: 'Deve conter 8 caracteres',
          validator: (_, value) => {
            if (!value) return Promise.resolve();

            const valorValidar = removerTudoQueNaoEhDigito(value);

            const regexValido = /^[0-9]{8}/.test(valorValidar);

            const valido = regexValido && valorValidar?.length === 8;

            if (valido) return Promise.resolve();

            return Promise.reject();
          },
        },
      ]}
    >
      <Input placeholder='Informe o CEP' maxLength={9} {...inputProps} />
    </Form.Item>
  );
};

export default InputCEP;
