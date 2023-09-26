import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_DIMENSAO_DIAMETRO } from '~/core/constants/ids/input';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';

const InputDimensaoDiametro: React.FC = () => {
  return (
    <InputNumero
      inputProps={{
        id: CDEP_INPUT_DIMENSAO_DIAMETRO,
        maxLength: 5,
        placeholder: 'Dimensão Diamêtro (cm)',
      }}
      formItemProps={{
        label: 'Dimensão Diamêtro (cm)',
        name: 'diametro',
        getValueFromEvent: (e: React.ChangeEvent<HTMLInputElement>) =>
          formatarDuasCasasDecimais(e?.target?.value),
      }}
    />
  );
};

export default InputDimensaoDiametro;
