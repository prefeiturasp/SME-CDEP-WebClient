import { SituacaoSolicitacaoItemEnum } from '../enum/situacao-item-atendimento-enum';
import { TipoAcervo } from '../enum/tipo-acervo';
import { TipoAtendimentoEnum } from '../enum/tipo-atendimento-enum';

export type AcervoSolicitacaoItemDetalheResumidoDTO = {
  id: number;
  codigo: string;
  tipoAcervo?: string;
  tipoAcervoId?: TipoAcervo;
  titulo: string;
  situacao?: string;
  situacaoId?: SituacaoSolicitacaoItemEnum;
  dataVisita?: string;
  dataEmprestimo?: string;
  dataDevolucao?: string;
  responsavel?: string;
  tipoAtendimento?: TipoAtendimentoEnum;
  acervoId: number;
  situacaoEmprestimo?: number;
  estaDisponivel?: boolean;
  situacaoDisponibilidade?: string;
  temControleDisponibilidade?: boolean;
};
