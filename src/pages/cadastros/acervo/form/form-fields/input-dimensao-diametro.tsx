import React from 'react';
import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_DIMENSAO_DIAMETRO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';

type InputDimensaoDiametroProps = {
  extra?: React.ReactNode;
};
const InputDimensaoDiametro: React.FC<InputDimensaoDiametroProps> = ({ extra }) => {
  return (
    <InputNumero
      inputProps={{
        id: CDEP_INPUT_DIMENSAO_DIAMETRO,
        maxLength: 5,
        placeholder: 'Dimensão diâmetro (cm)',
      }}
      formItemProps={{
        extra,
        label: 'Dimensão diâmetro (cm)',
        name: AcervoFieldName[FieldAcervoEnum.DimensaoDiametro],
        getValueFromEvent: (e: React.ChangeEvent<HTMLInputElement>) =>
          formatarDuasCasasDecimais(e?.target?.value),
      }}
    />
  );
};

export default InputDimensaoDiametro;
