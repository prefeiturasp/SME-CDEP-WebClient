import { FieldAcervoProps } from '~/core/dto/form-cadastro-acervo';
import { FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

export const FieldsArtesGraficas: FieldAcervoProps[] = [
  {
    fieldAcervo: FieldAcervoEnum.Titulo,
  },
  {
    fieldAcervo: FieldAcervoEnum.Tombo,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Credito,
  },
  {
    fieldAcervo: FieldAcervoEnum.Localizacao,
  },
  {
    fieldAcervo: FieldAcervoEnum.Procedencia,
  },
  {
    fieldAcervo: FieldAcervoEnum.Ano,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.CopiaDigital,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.AutorizacaoUsoImagem,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.EstadoConservacao,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Cromia,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.DimensaoLargura,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.DimensaoAltura,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.DimensaoDiametro,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Tecnica,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Suporte,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Quantidade,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Descricao,
  },
  { fieldAcervo: FieldAcervoEnum.SituacaoAcervo, sm: 12 },
  {
    fieldAcervo: FieldAcervoEnum.Anexos,
  },
];
