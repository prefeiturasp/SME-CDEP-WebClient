import React from 'react';
import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_QUANTIDADE } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputQuantidadeProps = {
  extra?: React.ReactNode;
};
const InputQuantidade: React.FC<InputQuantidadeProps> = ({ extra }) => {
  return (
    <InputNumero
      inputProps={{ id: CDEP_INPUT_QUANTIDADE, maxLength: 4, placeholder: 'Quantidade' }}
      formItemProps={{
        label: 'Quantidade',
        name: AcervoFieldName[FieldAcervoEnum.Quantidade],
        rules: [{ required: true }],
        extra,
      }}
    />
  );
};

export default InputQuantidade;
