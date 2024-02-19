import { Dayjs } from '~/core/date/dayjs';

export type AlterarDataVisitaAcervoSolicitacaoItemDTO = {
  id: number;
  dataVisita: string | Dayjs;
};
