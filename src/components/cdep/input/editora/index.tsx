import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_EDITORA } from '~/core/constants/ids/select';
import { obterEditoraResumido } from '~/core/services/editora-service';

type SelectEditoraProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectEditora: React.FC<SelectEditoraProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterEditoras = async () => {
    const resposta = await obterEditoraResumido();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.nome, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterEditoras();
  }, []);

  return (
    <Form.Item label='Editora' name='idEditora' {...formItemProps}>
      <Select
        showSearch
        allowClear
        id={CDEP_SELECT_EDITORA}
        {...selectProps}
        options={options}
        placeholder='Editora'
      />
    </Form.Item>
  );
};

export default SelectEditora;
