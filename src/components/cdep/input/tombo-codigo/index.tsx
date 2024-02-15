import { Form, FormItemProps, Input, InputProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useState } from 'react';
import { obterCodigoTombo } from '~/core/services/acervo-service';

type InputCodigoTomboProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
  setDadosCodigoTombo?: any;
};

export const InputCodigoTombo: React.FC<InputCodigoTomboProps> = ({
  inputProps,
  formItemProps,
  setDadosCodigoTombo,
}) => {
  const form = useFormInstance();
  const codigoTombo = Form.useWatch('codigoTombo', form);
  const [loading, setLoading] = useState<boolean>(false);

  const buscarTomboCodigo = async () => {
    setLoading(true);
    obterCodigoTombo(codigoTombo).then((resposta) => {
      if (resposta.sucesso) {
        const dados = resposta?.dados;

        form.setFieldsValue({ titulo: dados.nome });
        setDadosCodigoTombo(dados);
      }
    });
    setLoading(false);
  };

  return (
    <Form.Item
      label='N° do tombo/código'
      name='codigoTombo'
      rules={[{ required: true }]}
      {...formItemProps}
    >
      <Input.Search
        maxLength={15}
        loading={loading}
        onSearch={buscarTomboCodigo}
        placeholder='N° do tombo/código'
        {...inputProps}
      />
    </Form.Item>
  );
};
