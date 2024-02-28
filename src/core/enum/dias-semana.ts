export enum DiasSemanaEnum {
  Domingo = 0,
  Segunda = 1,
  Terça = 2,
  Quarta = 3,
  Quinta = 4,
  Sexta = 5,
  Sabado = 6,
}

export const DiasSemanaEnumEnumDisplay: Record<DiasSemanaEnum, string> = {
  [DiasSemanaEnum.Domingo]: 'Domingo',
  [DiasSemanaEnum.Segunda]: 'Segunda',
  [DiasSemanaEnum.Terça]: 'Terça',
  [DiasSemanaEnum.Quarta]: 'Quarta',
  [DiasSemanaEnum.Quinta]: 'Quinta',
  [DiasSemanaEnum.Sexta]: 'Sexta',
  [DiasSemanaEnum.Sabado]: 'Sábado',
};
