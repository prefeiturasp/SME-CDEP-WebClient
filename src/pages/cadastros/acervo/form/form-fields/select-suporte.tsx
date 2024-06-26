import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_ESTADO_SUPORTE } from '~/core/constants/ids/select';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoSuporte } from '~/core/enum/tipo-suporte';
import { obterListaSuporte } from '~/core/services/suporte-service';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Suporte];

type SelectSuporteProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  tipoAcervo: TipoAcervo;
};
const SelectSuporte: React.FC<SelectSuporteProps> = ({
  selectProps,
  formItemProps,
  tipoAcervo,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    let tipoSuporte = TipoSuporte.NAO_DEFINIDO;

    switch (tipoAcervo) {
      case TipoAcervo.Fotografico:
        tipoSuporte = TipoSuporte.IMAGEM;
        break;
      case TipoAcervo.Audiovisual:
        tipoSuporte = TipoSuporte.VIDEO;
        break;
      case TipoAcervo.ArtesGraficas:
        tipoSuporte = TipoSuporte.IMAGEM;
        break;
      default:
        break;
    }

    const resposta = await obterListaSuporte(tipoSuporte);

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
        id={CDEP_SELECT_ESTADO_SUPORTE}
        {...selectProps}
        options={options}
        placeholder={fieldProps.label}
      />
    </Form.Item>
  );
};

export default SelectSuporte;
