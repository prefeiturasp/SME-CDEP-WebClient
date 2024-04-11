import React from 'react';
import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_DIMENSAO_ALTURA } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.DimensaoAltura];

type InputDimensaoAlturaProps = {
  extra?: React.ReactNode;
};
const InputDimensaoAltura: React.FC<InputDimensaoAlturaProps> = ({ extra }) => (
  <InputNumero
    inputProps={{
      id: CDEP_INPUT_DIMENSAO_ALTURA,
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

export default InputDimensaoAltura;
