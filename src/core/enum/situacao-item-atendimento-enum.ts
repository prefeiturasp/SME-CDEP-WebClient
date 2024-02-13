export enum SituacaoSolicitacaoItemEnum {
  AGUARDANDO_ATENDIMENTO = 1,
  AGUARDANDO_VISITA = 2,
  FINALIZADO_AUTOMATICAMENTE = 3,
  CANCELADO = 4,
  FINALIZADO_MANUALMENTE = 5,
}

export const SituacaoSolicitacaoItemEnumDisplay: Record<SituacaoSolicitacaoItemEnum, string> = {
  [SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO]: 'Aguardando atendimento',
  [SituacaoSolicitacaoItemEnum.AGUARDANDO_VISITA]: 'Aguardando visita',
  [SituacaoSolicitacaoItemEnum.FINALIZADO_AUTOMATICAMENTE]: 'Finalizado automaticamente',
  [SituacaoSolicitacaoItemEnum.CANCELADO]: 'Cancelado',
  [SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE]: 'Finalizado manualmente',
};
