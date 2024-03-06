import { SituacaoSolicitacaoItemEnum } from '../enum/situacao-item-atendimento-enum';
import { TipoAtendimentoEnum } from '../enum/tipo-atendimento-enum';

export type AcervoSolicitacaoItemDetalheResumidoDTO = {
  id: number;
  codigo: string;
  tipoAcervo?: string;
  titulo: string;
  situacao?: string;
  situacaoId?: SituacaoSolicitacaoItemEnum;
  dataVisita?: string;
  responsavelRf?: string;
  tipoAtendimento: TipoAtendimentoEnum;
  acervoId: number;
};
