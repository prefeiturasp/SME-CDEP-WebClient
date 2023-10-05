import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_CROMIA } from '~/core/constants/ids/select';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { obterListaCromia } from '~/core/services/cromia-service';

type SelectCromiaProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  tipoAcervo?: TipoAcervo;
};

const SelectCromia: React.FC<SelectCromiaProps> = ({ selectProps, formItemProps, tipoAcervo }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [required, setRequired] = useState<boolean>(true);

  const obterDados = async () => {
    const resposta = await obterListaCromia();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.nome, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  const validarCampoObrigatorio = async () => {
    switch (tipoAcervo) {
      case TipoAcervo.Audiovisual:
        setRequired(false);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    obterDados();
    validarCampoObrigatorio();
  }, []);

  return (
    <Form.Item label='Cromia' name='cromiaId' rules={[{ required }]} {...formItemProps}>
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
