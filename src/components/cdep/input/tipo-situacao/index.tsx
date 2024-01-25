import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_SOLICITACAO_SITUACOES } from '~/core/constants/ids/select';
import { SituacaoItemDTO } from '~/core/dto/situacao-dto';

import { obterSituacoesAcervo } from '~/core/services/acervo-solicitacao-service';

type SelectTipoSituacaoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectTipoSituacao: React.FC<SelectTipoSituacaoProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterTipos = async () => {
    const resposta = await obterSituacoesAcervo();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item: SituacaoItemDTO) => ({
        label: item.nome,
        value: item.id
      }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterTipos();
  }, []);

  return (
    <Form.Item label='Tipo de situação' name='situacaoItem' {...formItemProps}>
      <Select
        showSearch
        allowClear
        id={CDEP_SELECT_SOLICITACAO_SITUACOES}
        {...selectProps}
        options={options}
        placeholder='Tipo de situação'
      />
    </Form.Item>
  );
};

export default SelectTipoSituacao;
