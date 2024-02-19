import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_SOLICITACAO_SITUACOES } from '~/core/constants/ids/select';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';

type SelectTipoAtendimentoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};
export const SelectTipoAtendimento: React.FC<SelectTipoAtendimentoProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await acervoSolicitacaoService.obterTipoAtendimento();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        label: item.nome,
        value: item.id,
      }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Form.Item
      name='tipoAtendimento'
      {...formItemProps}
      rules={[
        {
          required: true,
        },
      ]}
    >
      <Select
        allowClear
        id={CDEP_SELECT_SOLICITACAO_SITUACOES}
        {...selectProps}
        options={options}
        placeholder='Tipo de atendimento'
      />
    </Form.Item>
  );
};
