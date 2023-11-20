import React, { useEffect, useState } from 'react';
import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_NUMERO_DE_PAGINAS } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';

type InputNumeroDePaginasProps = {
  tipoAcervo: TipoAcervo;
  extra?: React.ReactNode;
};

const InputNumeroDePaginas: React.FC<InputNumeroDePaginasProps> = ({ tipoAcervo, extra }) => {
  const [required, setRequired] = useState<boolean>(false);

  const validarCampoObrigatorio = () => {
    switch (tipoAcervo) {
      case TipoAcervo.DocumentacaoHistorica:
        setRequired(true);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    validarCampoObrigatorio();
  }, []);

  return (
    <InputNumero
      inputProps={{
        id: CDEP_INPUT_NUMERO_DE_PAGINAS,
        maxLength: 4,
        placeholder: 'Número de páginas',
      }}
      formItemProps={{
        label: 'Número de páginas',
        name: AcervoFieldName[FieldAcervoEnum.NumeroDePaginas],
        rules: [{ required }],
        extra,
      }}
    />
  );
};

export default InputNumeroDePaginas;
