import { setAcervosSelecionados, SetAcervosSelecionados } from './actions';
import solicitacaoReducer from './reducers';

describe('solicitacao redux reducer', () => {
  it('C02: deve retornar o estado inicial quando estado for undefined e action desconhecida', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' } as unknown as SetAcervosSelecionados;
    expect(solicitacaoReducer(undefined, unknownAction)).toEqual({
      acervosSelecionados: [],
    });
  });

  it('C03: deve atualizar e limpar acervosSelecionados ao receber setAcervosSelecionados', () => {
    const updatedState = solicitacaoReducer(undefined, setAcervosSelecionados([1, 2, 3]));
    expect(updatedState).toEqual({
      acervosSelecionados: [1, 2, 3],
    });

    const clearedState = solicitacaoReducer(updatedState, setAcervosSelecionados([]));
    expect(clearedState).toEqual({
      acervosSelecionados: [],
    });
  });
});
