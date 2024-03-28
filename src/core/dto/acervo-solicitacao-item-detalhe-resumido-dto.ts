import { Dayjs } from 'dayjs';
import { SituacaoSolicitacaoItemEnum } from '../enum/situacao-item-atendimento-enum';
import { TipoAcervo } from '../enum/tipo-acervo';
import { TipoAtendimentoEnum } from '../enum/tipo-atendimento-enum';

export type AcervoSolicitacaoItemDetalheResumidoDTO = {
  id: number;
  codigo: string;
  tipoAcervo?: string;
  titulo: string;
  situacao?: string;
  situacaoId?: SituacaoSolicitacaoItemEnum;
  dataVisita?: string | Dayjs;
  dataVisitaFormatada?: string;
  tipoAtendimento?: TipoAtendimentoEnum;
  acervoId: number;
  responsavel?: string;
  tipoAcervoId?: TipoAcervo;
  dataEmprestimo?: string;
  dataEmprestimoFormatada?: string;
  dataDevolucao?: string;
  dataDevolucaoFormatada?: string;
  situacaoEmprestimo?: number;
  situacaoDisponibilidade?: string;
  estaDisponivel?: boolean;
  temControleDisponibilidade?: boolean;
  horaVisita?: string;
  podeFinalizarItem?: boolean;
};
