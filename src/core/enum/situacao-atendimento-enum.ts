export enum SituacaoSolicitacaoEnum {
  AGUARDANDO_ATENDIMENTO = 1,
  FINALIZADO_ATENDIMENTO = 2,
  AGUARDANDO_VISITA = 3,
  CANCELADO = 4,
  ATENDIDO_PARCIALMENTE = 5,
}

export const SituacaoSolicitacaoEnumDisplay: Record<SituacaoSolicitacaoEnum, string> = {
  [SituacaoSolicitacaoEnum.AGUARDANDO_ATENDIMENTO]: 'Aguardando atendimento',
  [SituacaoSolicitacaoEnum.FINALIZADO_ATENDIMENTO]: 'Finalizado atendimento',
  [SituacaoSolicitacaoEnum.AGUARDANDO_VISITA]: 'Aguardando visita',
  [SituacaoSolicitacaoEnum.CANCELADO]: 'Cancelado',
  [SituacaoSolicitacaoEnum.ATENDIDO_PARCIALMENTE]: 'Atendido parcialmente',
};
