export enum TipoAtendimentoEnum {
  Email = 1,
  Presencial = 2,
}

export const TipoAtendimentoEnumDisplay: Record<TipoAtendimentoEnum, string> = {
  [TipoAtendimentoEnum.Email]: 'Email',
  [TipoAtendimentoEnum.Presencial]: 'Presencial',
};
