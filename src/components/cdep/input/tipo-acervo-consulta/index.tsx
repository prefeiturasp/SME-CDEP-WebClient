import { SelectProps, Typography } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_TIPO_ACERVO } from '~/core/constants/ids/select';
import { obterTiposAcervo } from '~/core/services/acervo-service';

type SelectTipoAcervoConsultaProps = {
  selectProps?: SelectProps;
  onSelect?: (value: string) => void;
};

const SelectTipoAcervoConsulta: React.FC<SelectTipoAcervoConsultaProps> = ({
  selectProps,
  onSelect,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterTipos = async () => {
    const resposta = await obterTiposAcervo();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.nome, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterTipos();
  }, []);

  const opcaoSelecionado = (value: string) => {
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <>
      <Typography style={{ color: '#fff', fontWeight: 'bold' }}>
        Busca por tipos de acervos
      </Typography>
      <Select
        showSearch
        allowClear
        {...selectProps}
        options={options}
        style={{ width: '100%' }}
        onSelect={opcaoSelecionado}
        placeholder='Tipo de acervo'
        id={CDEP_SELECT_TIPO_ACERVO}
      />
    </>
  );
};

export default SelectTipoAcervoConsulta;
