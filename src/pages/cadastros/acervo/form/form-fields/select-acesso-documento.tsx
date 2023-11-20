import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_ACESSO_DOCUMENTO } from '~/core/constants/ids/select';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { obterAcessoDocumento } from '~/core/services/acesso-documento-service';

type SelectAcessoDocumentoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectAcessoDocumento: React.FC<SelectAcessoDocumentoProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterAcessoDocumento();

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
    <Form.Item
      label='Acesso do documento'
      name={AcervoFieldName[FieldAcervoEnum.AcessoDocumento]}
      rules={[{ required: true }]}
      {...formItemProps}
    >
      <Select
        showSearch
        allowClear
        mode='multiple'
        id={CDEP_SELECT_ACESSO_DOCUMENTO}
        {...selectProps}
        options={options}
        placeholder='Acesso do documento'
      />
    </Form.Item>
  );
};

export default SelectAcessoDocumento;
