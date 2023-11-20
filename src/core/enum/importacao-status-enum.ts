export enum ImportacaoStatusEnum {
  Pendente = 1,
  ValidadoPreenchimentoValorFormatoQtdeCaracteres = 2,
  ValidacaoDominios = 3,
  Erros = 4,
  Sucesso = 5,
}

export const ImportacaoStatusEnumDisplay: Record<ImportacaoStatusEnum, string> = {
  [ImportacaoStatusEnum.Pendente]: 'Pendente de importação',
  [ImportacaoStatusEnum.ValidadoPreenchimentoValorFormatoQtdeCaracteres]:
    'Validado preenchimento, valor, formato e qtde caracteres',
  [ImportacaoStatusEnum.ValidacaoDominios]: 'Validacao de domínios',
  [ImportacaoStatusEnum.Erros]: 'Importado com Erros',
  [ImportacaoStatusEnum.Sucesso]: 'Importado com Sucesso',
};
