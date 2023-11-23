import React from 'react';
import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_DIMENSAO_LARGURA } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';

type InputDimensaoLarguraProps = {
  extra?: React.ReactNode;
};
const InputDimensaoLargura: React.FC<InputDimensaoLarguraProps> = ({ extra }) => {
  return (
    <InputNumero
      inputProps={{
        id: CDEP_INPUT_DIMENSAO_LARGURA,
        maxLength: 5,
        placeholder: 'Dimensão largura (cm)',
      }}
      formItemProps={{
        extra,
        label: 'Dimensão largura (cm)',
        name: AcervoFieldName[FieldAcervoEnum.DimensaoLargura],
        getValueFromEvent: (e: React.ChangeEvent<HTMLInputElement>) =>
          formatarDuasCasasDecimais(e?.target?.value),
      }}
    />
  );
};

export default InputDimensaoLargura;
