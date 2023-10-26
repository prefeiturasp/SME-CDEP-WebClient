import React, { useEffect, useState } from 'react';
import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_NUMERO_DE_PAGINAS } from '~/core/constants/ids/input';
import { TipoAcervo } from '~/core/enum/tipo-acervo';

type InputNumeroDePaginasProps = {
  tipoAcervo?: TipoAcervo;
};

const InputNumeroDePaginas: React.FC<InputNumeroDePaginasProps> = ({ tipoAcervo }) => {
  const [required, setRequired] = useState<boolean>(false);

  const validarCampoObrigatorio = () => {
    switch (tipoAcervo) {
      case TipoAcervo.Bibliografico:
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
        name: 'numeroPagina',
        rules: [{ required }],
      }}
    />
  );
};

export default InputNumeroDePaginas;
