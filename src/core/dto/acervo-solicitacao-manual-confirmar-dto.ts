import { AcervoSolicitacaoManualItemDTO } from './acervo-solicitacao-manual-dto';

export type AcervoSolicitacaoManualConfirmarDTO = {
  usuarioId: number | null;
  dataSolicitacao: string | undefined;
  itens: AcervoSolicitacaoManualItemDTO[];
};
