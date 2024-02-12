import { TipoAtendimentoEnum } from '../enum/tipo-atendimento-enum';

export type AcervoSolicitacaoItemDetalheResumidoDTO = {
  id: number;
  codigo: string;
  tipoAcervo: string;
  titulo: string;
  situacao: string;
  dataVisita?: string;
  tipoAtendimento: TipoAtendimentoEnum;
};
