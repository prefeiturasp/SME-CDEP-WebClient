import { SituacaoSolicitacaoManualEnum } from '../enum/situacao-atendimento-manual-enum';
import { TipoAtendimentoEnum } from '../enum/tipo-atendimento-enum';

export type AcervoSolicitacaoManualDTO = {
  id: number | null;
  codigo: string | null;
  titulo: string | null;
  situacao: string;
  situacaoId: SituacaoSolicitacaoManualEnum;
  dataVisita?: string;
  tipoAtendimento: string;
  tipoAtendimentoId: TipoAtendimentoEnum;
};

export type AcervoSolicitacaoManualItemDTO = {
  acervoId: number | null;
  situacao: number | null;
  dataVisita?: string | null;
  tipoAtendimento: number;
};
