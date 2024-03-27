export enum AcervoDisponibilidadeEnum {
  DISPONIVEL = 1,
  INDISPONIVEL = 2,
}

export enum AcervoDisponibilidadeSituacaoEnum {
  DISPONIVEL = 1,
  INDISPONIVEL_PARA_RESERVA_EMPRESTIMO = 2,
  RESERVADO = 3,
  EMPRESTADO = 4,
}

export const AcervoDisponibilidadeEnumDisplay: Record<AcervoDisponibilidadeEnum, string> = {
  [AcervoDisponibilidadeEnum.DISPONIVEL]: 'Disponível',
  [AcervoDisponibilidadeEnum.INDISPONIVEL]: 'Indisponível',
};

export const AcervoDisponibilidadeSituacaoEnumDisplay: Record<
  AcervoDisponibilidadeSituacaoEnum,
  string
> = {
  [AcervoDisponibilidadeSituacaoEnum.DISPONIVEL]: 'Disponível',
  [AcervoDisponibilidadeSituacaoEnum.INDISPONIVEL_PARA_RESERVA_EMPRESTIMO]:
    'Indisponível para reserva/emprestimo',
  [AcervoDisponibilidadeSituacaoEnum.RESERVADO]: 'Reservado',
  [AcervoDisponibilidadeSituacaoEnum.EMPRESTADO]: 'Emprestado',
};
