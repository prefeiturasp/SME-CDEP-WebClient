import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_NUMERO_DE_PAGINAS } from '~/core/constants/ids/input';

const InputNumeroDePaginas: React.FC = () => {
  return (
    <InputNumero
      inputProps={{
        id: CDEP_INPUT_NUMERO_DE_PAGINAS,
        maxLength: 4,
        placeholder: 'Número de Páginas',
      }}
      formItemProps={{
        label: 'Número de Páginas',
        name: 'numeroDePaginas',
        rules: [{ required: true }],
      }}
    />
  );
};

export default InputNumeroDePaginas;
