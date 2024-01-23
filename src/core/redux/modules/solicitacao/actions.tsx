export const typeSetAcervosSelecionados = '@solicitacao/setAcervosSelecionados';

export interface SetAcervosSelecionados {
  type: typeof typeSetAcervosSelecionados;
  payload: number[];
}

export const setAcervosSelecionados = (payload: number[]): SetAcervosSelecionados => {
  return {
    type: typeSetAcervosSelecionados,
    payload,
  };
};
