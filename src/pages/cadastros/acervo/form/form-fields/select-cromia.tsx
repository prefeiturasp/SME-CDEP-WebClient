import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_CROMIA } from '~/core/constants/ids/select';
import { obterListaCromia } from '~/core/services/cromia-service';

type SelectCromiaProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectCromia: React.FC<SelectCromiaProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterListaCromia();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.nome, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Form.Item label='Cromia' name='cromiaId' rules={[{ required: true }]} {...formItemProps}>
      <Select
        showSearch
        allowClear
        id={CDEP_SELECT_CROMIA}
        options={options}
        placeholder='Cromia'
        {...selectProps}
      />
    </Form.Item>
  );
};

export default SelectCromia;
