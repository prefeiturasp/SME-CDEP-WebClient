export enum ImportacaoStatusEnum {
  Pendente = 1,
  Erros = 2,
  Sucesso = 3,
}

export const ImportacaoStatusEnumDisplay: Record<ImportacaoStatusEnum, string> = {
  [ImportacaoStatusEnum.Pendente]: 'Pendente de importação',
  [ImportacaoStatusEnum.Erros]: 'Importado com Erros',
  [ImportacaoStatusEnum.Sucesso]: 'Importado com Sucesso',
};
