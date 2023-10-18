import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_CREDITO_AUTORIA } from '~/core/constants/ids/select';
import { obterCreditoAutorResumido } from '~/core/services/credito-autor-service';

type SelectCreditoAutoriaProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectCreditoAutoria: React.FC<SelectCreditoAutoriaProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterTipos = async () => {
    const resposta = await obterCreditoAutorResumido();

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
    <Form.Item label='Crédito/Autoria' name='creditoAutorId' {...formItemProps}>
      <Select
        showSearch
        allowClear
        id={CDEP_SELECT_CREDITO_AUTORIA}
        {...selectProps}
        options={options}
        placeholder='Crédito/Autoria'
      />
    </Form.Item>
  );
};

export default SelectCreditoAutoria;
