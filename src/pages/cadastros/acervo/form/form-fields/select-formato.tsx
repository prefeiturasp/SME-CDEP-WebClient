import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_ESTADO_FORMATO_IMAGEM } from '~/core/constants/ids/select';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { obterFormatosImagem } from '~/core/services/formato-service';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.FormatoImagem];

type SelectFormatoImagemProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};
const SelectFormatoImagem: React.FC<SelectFormatoImagemProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterFormatosImagem();

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
        id={CDEP_SELECT_ESTADO_FORMATO_IMAGEM}
        {...selectProps}
        options={options}
        placeholder={fieldProps.label}
      />
    </Form.Item>
  );
};

export default SelectFormatoImagem;
