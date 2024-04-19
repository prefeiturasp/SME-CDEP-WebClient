import { FieldAcervoDetalhesProps } from '~/core/dto/form-cadastro-detalhes';
import { FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

export const FieldsDetalhesTridimensional: FieldAcervoDetalhesProps[] = [
  {
    fieldAcervo: FieldAcervoEnum.Titulo,
  },
  {
    fieldAcervo: FieldAcervoEnum.Tombo,
  },
  {
    fieldAcervo: FieldAcervoEnum.Procedencia,
  },
  {
    fieldAcervo: FieldAcervoEnum.Ano,
  },
  {
    fieldAcervo: FieldAcervoEnum.DataAcervo,
  },
  {
    fieldAcervo: FieldAcervoEnum.EstadoConservacao,
  },
  {
    fieldAcervo: FieldAcervoEnum.Quantidade,
  },
  {
    fieldAcervo: FieldAcervoEnum.Descricao,
  },
  {
    fieldAcervo: FieldAcervoEnum.Dimensoes,
  },
];
