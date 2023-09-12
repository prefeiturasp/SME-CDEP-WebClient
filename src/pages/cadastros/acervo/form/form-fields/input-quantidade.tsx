import InputNumero from '~/components/lib/inputs/number';
import { CDEP_INPUT_QUANTIDADE } from '~/core/constants/ids/input';

const InputQuantidade: React.FC = () => {
  return (
    <InputNumero
      inputProps={{ id: CDEP_INPUT_QUANTIDADE, maxLength: 4, placeholder: 'Quantidade' }}
      formItemProps={{ label: 'Quantidade', name: 'quantidade', rules: [{ required: true }] }}
    />
  );
};

export default InputQuantidade;
