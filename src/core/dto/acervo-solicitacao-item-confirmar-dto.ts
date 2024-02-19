import { TipoAtendimentoEnum } from '../enum/tipo-atendimento-enum';

export type AcervoSolicitacaoItemConfirmarDTO = {
  id: number;
  tipoAtendimento: TipoAtendimentoEnum;
  dataVisita?: string;
};
