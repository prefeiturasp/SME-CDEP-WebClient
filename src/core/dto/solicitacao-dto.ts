import { MinhaSolicitacaoDTO } from "./minha-solicitacao-dto";

export type SolicitacaoDTO = {
  responsavel: string;
  tipoAcervo: string;
  acervoSolicitacaoId: string;
} & MinhaSolicitacaoDTO;