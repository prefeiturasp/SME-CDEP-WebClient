import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_SOLICITACAO_SITUACOES } from '~/core/constants/ids/select';
import { SituacaoItemDTO } from '~/core/dto/situacao-item-dto';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';

type SelectSituacaoAtendimentoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};
export const SelectSituacaoAtendimento: React.FC<SelectSituacaoAtendimentoProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await acervoSolicitacaoService.obterSituacoesAtendimento();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item: SituacaoItemDTO) => ({
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
    <Form.Item label='Situação do atendimento' name='situacaoItem' {...formItemProps}>
      <Select
        showSearch
        allowClear
        id={CDEP_SELECT_SOLICITACAO_SITUACOES}
        {...selectProps}
        options={options}
        placeholder='Situação do atendimento'
      />
    </Form.Item>
  );
};
