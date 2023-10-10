import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_DIMENSAO_LARGURA } from '~/core/constants/ids/input';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';

const InputDimensaoLargura: React.FC = () => {
  return (
    <InputNumero
      inputProps={{
        id: CDEP_INPUT_DIMENSAO_LARGURA,
        maxLength: 5,
        placeholder: 'Dimensão largura (cm)',
      }}
      formItemProps={{
        label: 'Dimensão largura (cm)',
        name: 'largura',
        getValueFromEvent: (e: React.ChangeEvent<HTMLInputElement>) =>
          formatarDuasCasasDecimais(e?.target?.value),
      }}
    />
  );
};

export default InputDimensaoLargura;
