import { FieldAcervoProps } from '~/core/dto/form-cadastro-acervo';
import { FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

export const FieldsTridimensional: FieldAcervoProps[] = [
  {
    fieldAcervo: FieldAcervoEnum.Titulo,
  },
  {
    fieldAcervo: FieldAcervoEnum.Tombo,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Procedencia,
  },
  {
    fieldAcervo: FieldAcervoEnum.Ano,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.EstadoConservacao,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Quantidade,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Descricao,
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
    fieldAcervo: FieldAcervoEnum.DimensaoProfundidade,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.DimensaoDiametro,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Anexos,
  },
];
