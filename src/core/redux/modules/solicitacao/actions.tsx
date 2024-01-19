import { PesquisaAcervoDTO } from "~/core/dto/pesquisa-acervo-dto";

export const typeSetAcervosSelecionados = '@solicitacao/setAcervosSelecionados';

export interface SetAcervosSelecionados {
  type: typeof typeSetAcervosSelecionados;
  payload: PesquisaAcervoDTO[];
}

export const setAcervosSelecionados = (payload: PesquisaAcervoDTO[]): SetAcervosSelecionados => {
  return {
    type: typeSetAcervosSelecionados,
    payload,
  };
};
