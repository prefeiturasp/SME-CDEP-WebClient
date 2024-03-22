import { Dayjs } from '../date/dayjs';
import { TipoAtendimentoEnum } from '../enum/tipo-atendimento-enum';

export type AcervoSolicitacaoConfirmarDTO = {
  id: number;
  itemId?: number;
  tipoAtendimento?: TipoAtendimentoEnum;
  dataVisita?: Dayjs;
  dataEmprestimo?: string;
  dataDevolucao?: string;
  tipoAcervo?: number;
};
