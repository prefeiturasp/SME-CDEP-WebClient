export enum TipoEventoEnum {
  VISITA = 1,
  FERIADO = 2,
  SUSPENSAO = 3,
}

export const TipoEventoEnumDisplay: Record<TipoEventoEnum, string> = {
  [TipoEventoEnum.VISITA]: 'Visita',
  [TipoEventoEnum.FERIADO]: 'Feriado',
  [TipoEventoEnum.SUSPENSAO]: 'Suspensão',
};
