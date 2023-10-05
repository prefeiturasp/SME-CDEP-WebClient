import { FieldAcervoProps } from '~/core/dto/form-cadastro-acervo';
import { FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

export const FieldsArtesGraficas: FieldAcervoProps[] = [
  {
    fieldCervo: FieldAcervoEnum.Titulo,
  },
  {
    fieldCervo: FieldAcervoEnum.Tombo,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Credito,
  },
  {
    fieldCervo: FieldAcervoEnum.Localizacao,
  },
  {
    fieldCervo: FieldAcervoEnum.Procedencia,
  },
  {
    fieldCervo: FieldAcervoEnum.DataAcervo,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.CopiaDigital,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.AutorizacaoUsoImagem,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.EstadoConservacao,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Cromia,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.DimensaoLargura,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.DimensaoAltura,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.DimensaoDiametro,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Tecnica,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Suporte,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Quantidade,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Descricao,
  },
  {
    fieldCervo: FieldAcervoEnum.Anexos,
  },
];
