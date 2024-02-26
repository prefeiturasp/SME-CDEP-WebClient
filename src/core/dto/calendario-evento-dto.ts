import { TipoEventoEnum } from '../enum/tipo-evento-enum';

export type CalendarioEventoDTO = {
  semanas: SemanaDTO[] | undefined;
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
