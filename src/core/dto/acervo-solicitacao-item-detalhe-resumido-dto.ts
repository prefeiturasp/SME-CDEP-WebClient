import { SituacaoSolicitacaoItemEnum } from '../enum/situacao-item-atendimento-enum';
import { TipoAtendimentoEnum } from '../enum/tipo-atendimento-enum';

export type AcervoSolicitacaoItemDetalheResumidoDTO = {
  id: number;
  codigo: string;
  tipoAcervo?: string;
  tipoAcervoId?: number;
  titulo: string;
  situacao?: string;
  situacaoId?: SituacaoSolicitacaoItemEnum;
  dataVisita?: string;
  responsavel?: string;
  tipoAtendimento: TipoAtendimentoEnum;
  acervoId: number;
};
