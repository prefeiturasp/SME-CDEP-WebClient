import { produce } from 'immer';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';

import { SetAcervosSelecionados, typeSetAcervosSelecionados } from './actions';

type InitialValuesProps = {
  acervosSelecionados: PesquisaAcervoDTO[];
};
const initialValues: InitialValuesProps = {
  acervosSelecionados: [],
};

const solicitacao = (state = initialValues, action: SetAcervosSelecionados) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetAcervosSelecionados:
        return { ...draft, acervosSelecionados: action.payload };
      default:
        return draft;
    }
  });
};

export default solicitacao;
