import React from 'react';
import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_DIMENSAO_PROFUNDIDADE } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';

type InputDimensaoProfundidadeProps = {
  extra?: React.ReactNode;
};
const InputDimensaoProfundidade: React.FC<InputDimensaoProfundidadeProps> = ({ extra }) => {
  return (
    <InputNumero
      inputProps={{
        id: CDEP_INPUT_DIMENSAO_PROFUNDIDADE,
        maxLength: 5,
        placeholder: 'Dimensão profundidade (cm)',
      }}
      formItemProps={{
        extra,
        label: 'Dimensão profundidade (cm)',
        name: AcervoFieldName[FieldAcervoEnum.DimensaoProfundidade],
        getValueFromEvent: (e: React.ChangeEvent<HTMLInputElement>) =>
          formatarDuasCasasDecimais(e?.target?.value),
      }}
    />
  );
};

export default InputDimensaoProfundidade;
