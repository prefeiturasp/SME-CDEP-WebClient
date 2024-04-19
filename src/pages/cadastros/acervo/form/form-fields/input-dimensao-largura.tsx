import React from 'react';
import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_DIMENSAO_LARGURA } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.DimensaoLargura];

type InputDimensaoLarguraProps = {
  extra?: React.ReactNode;
};
const InputDimensaoLargura: React.FC<InputDimensaoLarguraProps> = ({ extra }) => (
  <InputNumero
    inputProps={{
      id: CDEP_INPUT_DIMENSAO_LARGURA,
      maxLength: 6,
      placeholder: fieldProps.label,
    }}
    formItemProps={{
      extra,
      label: fieldProps.label,
      name: fieldProps.name,
      getValueFromEvent: (e: React.ChangeEvent<HTMLInputElement>) =>
        formatarDuasCasasDecimais(e?.target?.value),
    }}
  />
);

export default InputDimensaoLargura;
