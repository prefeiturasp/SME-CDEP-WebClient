import React from 'react';
import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_DIMENSAO_ALTURA } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';

type InputDimensaoAlturaProps = {
  extra?: React.ReactNode;
};
const InputDimensaoAltura: React.FC<InputDimensaoAlturaProps> = ({ extra }) => {
  return (
    <InputNumero
      inputProps={{
        id: CDEP_INPUT_DIMENSAO_ALTURA,
        maxLength: 5,
        placeholder: 'Dimensão altura (cm)',
      }}
      formItemProps={{
        extra,
        label: 'Dimensão altura (cm)',
        name: AcervoFieldName[FieldAcervoEnum.DimensaoAltura],
        getValueFromEvent: (e: React.ChangeEvent<HTMLInputElement>) =>
          formatarDuasCasasDecimais(e?.target?.value),
      }}
    />
  );
};

export default InputDimensaoAltura;
