export enum AcervoDisponibilidadeEnum {
  ACERVO_RESERVADO = 1,
  ACERVO_DISPONIVEL = 0,
  ACERVO_EMPRESTADO = 2,
}

export const AcervoDisponibilidadeEnumDisplay: Record<AcervoDisponibilidadeEnum, string> = {
  [AcervoDisponibilidadeEnum.ACERVO_DISPONIVEL]: 'Acervo Disponível',
  [AcervoDisponibilidadeEnum.ACERVO_RESERVADO]: 'Acervo reservado pela solicitação NNN',
  [AcervoDisponibilidadeEnum.ACERVO_EMPRESTADO]: 'Acervo emprestado pela solicitação NNN',
};
