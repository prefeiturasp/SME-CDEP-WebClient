import { FieldAcervoProps } from '~/core/dto/form-cadastro-acervo';
import { FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

export const FieldsTridimensional: FieldAcervoProps[] = [
  {
    fieldCervo: FieldAcervoEnum.Titulo,
  },
  {
    fieldCervo: FieldAcervoEnum.Tombo,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Procedencia,
  },
  {
    fieldCervo: FieldAcervoEnum.DataAcervo,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.EstadoConservacao,
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
    fieldCervo: FieldAcervoEnum.DimensaoLargura,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.DimensaoAltura,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.DimensaoProfundidade,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.DimensaoDiametro,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Anexos,
  },
];
