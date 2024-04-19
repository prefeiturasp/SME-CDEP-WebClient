import { AcervoSolicitacaoItemRetornoCadastroDTO } from './acervo-solicitacao-item-retorno-cadastro-dto';

export type AcervoSolicitacaoRetornoCadastroDTO = {
  podeCancelarSolicitacao: boolean;
  itens: AcervoSolicitacaoItemRetornoCadastroDTO[];
};
