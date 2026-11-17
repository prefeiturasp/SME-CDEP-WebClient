import { setAcervosSelecionados, typeSetAcervosSelecionados } from './actions';

describe('solicitacao redux actions', () => {
  it('C01: deve criar a action setAcervosSelecionados com lista de IDs e lista vazia', () => {
    expect(setAcervosSelecionados([10, 20, 30])).toEqual({
      type: typeSetAcervosSelecionados,
      payload: [10, 20, 30],
    });

    expect(setAcervosSelecionados([])).toEqual({
      type: typeSetAcervosSelecionados,
      payload: [],
    });
  });
});
