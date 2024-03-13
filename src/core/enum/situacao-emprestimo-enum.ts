export enum SituacaoEmprestimoEnum {
  EMPRESTADO = 1,
  DEVOLUCAO_EM_ATRASO = 2,
  EMPRESTADO_PRORROGACAO = 3,
  DEVOLVIDO = 4,
  CANCELADO = 5,
}

export const SituacaoEmprestimoEnumDisplay: Record<SituacaoEmprestimoEnum, string> = {
  [SituacaoEmprestimoEnum.EMPRESTADO]: 'Emprestado',
  [SituacaoEmprestimoEnum.DEVOLUCAO_EM_ATRASO]: 'Devolução em atraso',
  [SituacaoEmprestimoEnum.EMPRESTADO_PRORROGACAO]: 'Emprestado - Prorrogação',
  [SituacaoEmprestimoEnum.DEVOLVIDO]: 'Devolvido',
  [SituacaoEmprestimoEnum.CANCELADO]: 'Cancelado',
};
