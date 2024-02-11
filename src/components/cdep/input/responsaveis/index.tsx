import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_RESPONSAVEIS } from '~/core/constants/ids/select';
import { ResponsavelDTO } from '~/core/dto/responsavel-dto';
import usuarioService from '~/core/services/usuario-service';

type SelectResponsaveisProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectResponsaveis: React.FC<SelectResponsaveisProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterResponsaveis = async () => {
    const resposta = await usuarioService.obterPerfisResponsaveis();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item: ResponsavelDTO) => ({
        label: item.nome,
        value: item.login,
      }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterResponsaveis();
  }, []);

  return (
    <Form.Item label='Responsável' name='responsavel' {...formItemProps}>
      <Select
        showSearch
        allowClear
        id={CDEP_SELECT_RESPONSAVEIS}
        {...selectProps}
        options={options}
        placeholder='Responsável'
      />
    </Form.Item>
  );
};

export default SelectResponsaveis;
