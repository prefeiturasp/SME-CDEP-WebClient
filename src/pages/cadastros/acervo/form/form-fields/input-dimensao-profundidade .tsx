import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_DIMENSAO_PROFUNDIDADE } from '~/core/constants/ids/input';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';

const InputDimensaoProfundidade: React.FC = () => {
  return (
    <InputNumero
      inputProps={{
        id: CDEP_INPUT_DIMENSAO_PROFUNDIDADE,
        maxLength: 5,
        placeholder: 'Dimensão profundidade (cm)',
      }}
      formItemProps={{
        label: 'Dimensão profundidade (cm)',
        name: 'profundidade',
        getValueFromEvent: (e: React.ChangeEvent<HTMLInputElement>) =>
          formatarDuasCasasDecimais(e?.target?.value),
      }}
    />
  );
};

export default InputDimensaoProfundidade;
