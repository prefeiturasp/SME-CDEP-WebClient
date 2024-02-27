import { Form, FormItemProps, Input, InputProps } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useState } from 'react';
import usuarioService from '~/core/services/usuario-service';

type InputRfCpfSolicitanteProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
  obterFiltros?: () => void;
};

export const InputRfCpfSolicitante: React.FC<InputRfCpfSolicitanteProps> = ({
  inputProps,
  formItemProps,
  obterFiltros,
}) => {
  const form = useFormInstance();

  const rfCpfSolicitante = useWatch('solicitanteRf', form);

  const [loading, setLoading] = useState<boolean>(false);

  const buscarRfCpf = async () => {
    setLoading(true);
    usuarioService.obterRfCpf(rfCpfSolicitante).then((resposta) => {
      if (resposta.sucesso) {
        const dados = resposta?.dados;

        form.setFieldValue('nomeSolicitante', dados.nome);
        if (obterFiltros) {
          obterFiltros();
        }
      }
    });
    setLoading(false);
  };

  return (
    <Form.Item label='RF ou CPF do Solicitante' name='solicitanteRf' {...formItemProps}>
      <Input.Search
        loading={loading}
        onSearch={buscarRfCpf}
        maxLength={11}
        placeholder='Informe o RF ou CPF do Solicitante'
        onChange={(e) => {
          if (e.target.value.length === 0) {
            form.setFieldValue('nomeSolicitante', []);
          }
        }}
        {...inputProps}
      />
    </Form.Item>
  );
};
