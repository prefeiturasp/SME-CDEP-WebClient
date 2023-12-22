import React from 'react';
import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_QUANTIDADE } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Quantidade];

type InputQuantidadeProps = {
  extra?: React.ReactNode;
};
const InputQuantidade: React.FC<InputQuantidadeProps> = ({ extra }) => (
  <InputNumero
    inputProps={{ id: CDEP_INPUT_QUANTIDADE, maxLength: 4, placeholder: fieldProps.label }}
    formItemProps={{
      label: fieldProps.label,
      name: fieldProps.name,
      rules: [{ required: true }],
      extra,
    }}
  />
);

export default InputQuantidade;
