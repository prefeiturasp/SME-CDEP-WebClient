import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_DIMENSAO_LARGURA } from '~/core/constants/ids/input';

const InputDimensaoLargura: React.FC = () => {
  return (
    <InputNumero
      inputProps={{
        id: CDEP_INPUT_DIMENSAO_LARGURA,
        maxLength: 4,
        placeholder: 'Dimensão Largura (cm)',
      }}
      formItemProps={{
        label: 'Dimensão Largura (cm)',
        name: 'largura',
      }}
    />
  );
};

export default InputDimensaoLargura;
