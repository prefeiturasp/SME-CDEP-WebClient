import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_DIMENSAO_ALTURA } from '~/core/constants/ids/input';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';

const InputDimensaoAltura: React.FC = () => {
  return (
    <InputNumero
      inputProps={{
        id: CDEP_INPUT_DIMENSAO_ALTURA,
        maxLength: 5,
        placeholder: 'Dimensão altura (cm)',
      }}
      formItemProps={{
        label: 'Dimensão altura (cm)',
        name: 'altura',
        getValueFromEvent: (e: React.ChangeEvent<HTMLInputElement>) =>
          formatarDuasCasasDecimais(e?.target?.value),
      }}
    />
  );
};

export default InputDimensaoAltura;
