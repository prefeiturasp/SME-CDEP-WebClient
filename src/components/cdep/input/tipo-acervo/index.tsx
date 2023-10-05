import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_TIPO_ACERVO } from '~/core/constants/ids/select';
import { obterTiposAcervo } from '~/core/services/acervo-service';

type SelectTipoAcervoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectTipoAcervo: React.FC<SelectTipoAcervoProps> = ({ selectProps, formItemProps }) => {
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

  return (
    <Form.Item label='Tipo de acervo' name='tipoAcervo' {...formItemProps}>
      <Select
        showSearch
        allowClear
        id={CDEP_SELECT_TIPO_ACERVO}
        {...selectProps}
        options={options}
        placeholder='Tipo de acervo'
      />
    </Form.Item>
  );
};

export default SelectTipoAcervo;
