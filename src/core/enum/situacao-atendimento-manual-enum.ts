export enum SituacaoSolicitacaoManualEnum {
  AGUARDANDO_VISITA = 1,
  FINALIZADO_MANUALMENTE = 2,
}

export const SituacaoSolicitacaoManualEnumDisplay: Record<SituacaoSolicitacaoManualEnum, string> = {
  [SituacaoSolicitacaoManualEnum.AGUARDANDO_VISITA]: 'Aguardando visita',
  [SituacaoSolicitacaoManualEnum.FINALIZADO_MANUALMENTE]: 'Finalizado manualmente',
};
