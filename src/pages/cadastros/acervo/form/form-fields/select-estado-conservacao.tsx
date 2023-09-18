import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_ESTADO_CONSERVACAO } from '~/core/constants/ids/select';
import { obterConservacoes } from '~/core/services/conservacao-service';

type SelectConservacaoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectConservacao: React.FC<SelectConservacaoProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterTipos = async () => {
    const resposta = await obterConservacoes();

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
    <Form.Item
      label='Estado de conservação'
      name='conservacaoId'
      rules={[{ required: true }]}
      {...formItemProps}
    >
      <Select
        showSearch
        allowClear
        id={CDEP_SELECT_ESTADO_CONSERVACAO}
        {...selectProps}
        options={options}
        placeholder='Estado de conservação'
      />
    </Form.Item>
  );
};

export default SelectConservacao;
