import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_SITUACAO_EMPRESTIMO } from '~/core/constants/ids/select';
import { SituacaoItemDTO } from '~/core/dto/situacao-item-dto';
import { obterSituacoesEmprestimo } from '~/core/services/acervo-emprestimo';

type SelectSituacaoEmprestimoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

export const SelectSituacaoEmprestimoFiltrado: React.FC<SelectSituacaoEmprestimoProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterSituacoesEmprestimo();
    if (resposta.sucesso) {
      const newOptions = resposta.dados
        .filter((item: SituacaoItemDTO) => item.id !== 4)
        .map((item: SituacaoItemDTO) => ({
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
    <Form.Item label='Situação do empréstimo' name='situacaoEmprestimo' {...formItemProps}>
      <Select
        showSearch
        allowClear
        id={CDEP_SELECT_SITUACAO_EMPRESTIMO}
        {...selectProps}
        options={options}
        placeholder='Situação do empréstimo'
      />
    </Form.Item>
  );
};
