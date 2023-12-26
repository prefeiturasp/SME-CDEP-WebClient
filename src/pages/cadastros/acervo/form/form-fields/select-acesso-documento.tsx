import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_ACESSO_DOCUMENTO } from '~/core/constants/ids/select';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { obterAcessoDocumento } from '~/core/services/acesso-documento-service';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.AcessoDocumento];

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
      label={fieldProps.label}
      name={fieldProps.name}
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
        placeholder={fieldProps.label}
      />
    </Form.Item>
  );
};

export default SelectAcessoDocumento;
