import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_ESTADO_SUPORTE } from '~/core/constants/ids/select';
import { obterListaSuporte } from '~/core/services/suporte-service';

type SelectSuporteProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectSuporte: React.FC<SelectSuporteProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterListaSuporte();

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
    <Form.Item label='Suporte' name='suporteId' rules={[{ required: true }]} {...formItemProps}>
      <Select
        showSearch
        allowClear
        id={CDEP_SELECT_ESTADO_SUPORTE}
        {...selectProps}
        options={options}
        placeholder='Suporte'
      />
    </Form.Item>
  );
};

export default SelectSuporte;
