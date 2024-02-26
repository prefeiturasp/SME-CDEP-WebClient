import { TipoEventoEnum } from '../enum/tipo-evento-enum';

export type CalendarioEventoDTO = {
  semanas: SemanaDTO;
};

export type SemanaDTO = {
  dia: number;
  diaDaSemana: number;
  desabilitado: boolean;
  eventosTag: EventoTagDTO;
};

export type EventoTagDTO = {
  tipoId: number;
  tipo: TipoEventoEnum;
};
