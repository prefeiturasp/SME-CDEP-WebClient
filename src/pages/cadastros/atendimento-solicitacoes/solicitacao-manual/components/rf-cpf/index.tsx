import { Form, FormItemProps, Input, InputProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import dayjs from 'dayjs';
import React, { Dispatch, SetStateAction, useState } from 'react';
import usuarioService from '~/core/services/usuario-service';

type InputRfCpfProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
  setUsuarioId: Dispatch<SetStateAction<number | null>>;
};

export const InputRfCpf: React.FC<InputRfCpfProps> = ({
  inputProps,
  formItemProps,
  setUsuarioId,
}) => {
  const form = useFormInstance();
  const rfCpf = Form.useWatch('rfCpf', form);
  const [loading, setLoading] = useState<boolean>(false);

  const buscarRfCpf = async () => {
    setLoading(true);
    usuarioService.obterRfCpf(rfCpf).then((resposta) => {
      if (resposta.sucesso) {
        const dataAtual = dayjs();
        const dados = resposta?.dados;

        setUsuarioId(dados.id);

        form.setFieldsValue({
          nome: dados.nome,
          telefone: dados.telefone,
          email: dados.email,
          endereco: dados.endereco,
          dataSolicitacao: dataAtual,
        });
      }
    });
    setLoading(false);
  };

  return (
    <Form.Item label='RF ou CPF' name='rfCpf' {...formItemProps}>
      <Input.Search
        loading={loading}
        onSearch={buscarRfCpf}
        maxLength={11}
        placeholder='Informe o RF ou CPF'
        {...inputProps}
      />
    </Form.Item>
  );
};
