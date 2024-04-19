import { FieldAcervoProps } from '~/core/dto/form-cadastro-acervo';
import { FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

export const FieldsBibliografico: FieldAcervoProps[] = [
  {
    fieldAcervo: FieldAcervoEnum.AcervoDisponivel,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Titulo,
  },
  {
    fieldAcervo: FieldAcervoEnum.Subtitulo,
  },
  {
    fieldAcervo: FieldAcervoEnum.Material,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Autor,
  },
  {
    fieldAcervo: FieldAcervoEnum.Coautor,
  },
  {
    fieldAcervo: FieldAcervoEnum.Editora,
  },
  {
    fieldAcervo: FieldAcervoEnum.Assunto,
  },
  {
    fieldAcervo: FieldAcervoEnum.Ano,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Edicao,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.NumeroDePaginas,
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
    fieldAcervo: FieldAcervoEnum.SerieColecao,
  },
  {
    fieldAcervo: FieldAcervoEnum.Volume,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Idioma,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.LocalizacaoCDD,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.LocalizacaoPHA,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.NotasGerais,
  },
  {
    fieldAcervo: FieldAcervoEnum.ISBN,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Tombo,
    sm: 12,
  },
];
