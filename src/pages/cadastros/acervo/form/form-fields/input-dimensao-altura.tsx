import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_DIMENSAO_ALTURA } from '~/core/constants/ids/input';

const InputDimensaoAltura: React.FC = () => {
  return (
    <InputNumero
      inputProps={{
        id: CDEP_INPUT_DIMENSAO_ALTURA,
        maxLength: 4,
        placeholder: 'Dimensão Altura (cm)',
      }}
      formItemProps={{
        label: 'Dimensão Altura (cm)',
        name: 'altura',
      }}
    />
  );
};

export default InputDimensaoAltura;
