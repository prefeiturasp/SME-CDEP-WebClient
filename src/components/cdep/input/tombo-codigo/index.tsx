import { Form, FormItemProps, Input, InputProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { obterCodigoTombo } from '~/core/services/acervo-service';

type InputCodigoTomboProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
  setTipoAcervo?: Dispatch<SetStateAction<TipoAcervo | undefined>>;
};

export const InputCodigoTombo: React.FC<InputCodigoTomboProps> = ({
  inputProps,
  formItemProps,
  setTipoAcervo,
}) => {
  const form = useFormInstance();
  const [loading, setLoading] = useState<boolean>(false);

  const buscarTomboCodigo = async (codigo: string) => {
    setLoading(true);
    obterCodigoTombo(codigo).then((resposta) => {
      if (resposta.sucesso) {
        const dados = resposta?.dados;

        if (setTipoAcervo && dados.tipo) {
          setTipoAcervo(dados?.tipo);
        }

        form.setFieldValue('dadosCodigoTombo', { ...dados });
      } else {
        form.setFieldValue('dadosCodigoTombo', undefined);
      }
    });
    setLoading(false);
  };

  const limparFormModal = (e: any) => {
    form.setFieldValue('dadosCodigoTombo', { codigo: e?.target?.value });
    form.setFieldValue('dataVisita', '');
    form.setFieldValue('tipoAtendimento', undefined);
  };

  return (
    <Form.Item
      label='N° do tombo/código'
      name={['dadosCodigoTombo', 'codigo']}
      rules={[{ required: true }]}
      {...formItemProps}
    >
      <Input.Search
        maxLength={15}
        loading={loading}
        onSearch={buscarTomboCodigo}
        placeholder='N° do tombo/código'
        onChange={limparFormModal}
        {...inputProps}
      />
    </Form.Item>
  );
};
