import { Form, FormItemProps, Input, InputProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useEffect } from 'react';
import usuarioService from '~/core/services/usuario-service';

type InputRfCpfProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
};

export const InputRfCpf: React.FC<InputRfCpfProps> = ({ inputProps, formItemProps }) => {
  const form = useFormInstance();

  const rfCpf = Form.useWatch('rfCpf', form);

  const buscarRfCpf = async () => {
    if (rfCpf?.length >= 7) {
      usuarioService.obterRfCpf(rfCpf).then((resposta) => {
        if (resposta.sucesso) {
          form.setFieldValue('rfCpf', resposta.dados);
        }
      });
    }
  };

  useEffect(() => {
    buscarRfCpf();
  });

  return (
    <Form.Item label='RF ou CPF' name='rfCpf' {...formItemProps}>
      <Input placeholder='Informe o CPF' {...inputProps} />
    </Form.Item>
  );
};
