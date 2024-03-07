import { MesesEnum } from '../enum/meses';
import { TipoEventoEnum } from '../enum/tipo-evento-enum';

export type CalendarioEventoDTO = {
  semanas?: SemanaDTO[];
};

export type SemanaDTO = {
  numero: number;
  dias: DiaDTO[];
};

export type DiaDTO = {
  dia: number;
  dayOfWeek: number;
  desabilitado: boolean;
  eventosTag: EventoTagDTO[];
};

export type EventoTagDTO = {
  tipoId: TipoEventoEnum;
  tipo: string;
};

export type EventoDetalheDTO = {
  id: number;
  tipo: string;
  titulo: string;
  descricao: string;
  justificativa: string;
  codigoTombo: string;
  solicitante: string;
  tipoId: TipoEventoEnum;
  acervoSolicitacaoId: number;
};

export type EventoCadastroDTO = {
  dia?: number;
  mes?: MesesEnum;
  tipo: TipoEventoEnum;
  descricao: string;
  justificativa: string;
};
