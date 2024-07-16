import { Dayjs } from 'dayjs';

export type AcervoEmprestimoProrrogacaoDTO = {
  acervoSolicitacaoItemId: number;
  dataDevolucao: string | Dayjs;
};
