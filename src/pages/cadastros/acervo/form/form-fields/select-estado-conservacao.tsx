import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_ESTADO_CONSERVACAO } from '~/core/constants/ids/select';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { obterConservacoes } from '~/core/services/conservacao-service';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.EstadoConservacao];

type SelectConservacaoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  tipoAcervo?: TipoAcervo;
};

const SelectConservacao: React.FC<SelectConservacaoProps> = ({
  selectProps,
  formItemProps,
  tipoAcervo,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [required, setRequired] = useState<boolean>(true);

  const obterTipos = async () => {
    const resposta = await obterConservacoes();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.nome, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  const validarCampoObrigatorio = () => {
    switch (tipoAcervo) {
      case TipoAcervo.Audiovisual:
      case TipoAcervo.DocumentacaoTextual:
        setRequired(false);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    obterTipos();
    validarCampoObrigatorio();
  }, []);

  return (
    <Form.Item
      label={fieldProps.label}
      name={fieldProps.name}
      rules={[{ required }]}
      {...formItemProps}
    >
      <Select
        showSearch
        allowClear
        id={CDEP_SELECT_ESTADO_CONSERVACAO}
        {...selectProps}
        options={options}
        placeholder={fieldProps.label}
      />
    </Form.Item>
  );
};

export default SelectConservacao;
