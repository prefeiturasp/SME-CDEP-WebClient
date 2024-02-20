import { Dayjs } from '~/core/date/dayjs';
import { TipoAtendimentoEnum } from '../enum/tipo-atendimento-enum';

export type AcervoSolicitacaoItemManualDTO = {
  id?: number;
  acervoId: number;
  tipoAtendimento: TipoAtendimentoEnum;
  dataVisita?: string;
};

export type AcervoSolicitacaoManualDTO = {
  id?: number;
  usuarioId?: number;
  dataSolicitacao: string | Dayjs;
  itens: AcervoSolicitacaoItemManualDTO[];
};

export type AcervoSolicitacaoManualFormDTO = {
  rfCpf: number;
  tipoAtendimento: TipoAtendimentoEnum;
  dataVisita?: string;
};
