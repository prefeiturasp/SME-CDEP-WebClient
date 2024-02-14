import { AcervoSolicitacaoItemDetalheResumidoDTO } from './acervo-solicitacao-item-detalhe-resumido-dto';
import { DadosSolicitanteDTO } from './dados-solicitante-dto';

export type AcervoSolicitacaoDetalheDTO = {
  dadosSolicitante: DadosSolicitanteDTO;
  id: number;
  usuarioId: number;
  dataSolicitacao: string;
  responsavel: string;
  situacao: string;
  situacaoId: number;
  itens: AcervoSolicitacaoItemDetalheResumidoDTO[];
};