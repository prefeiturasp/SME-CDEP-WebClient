import { FieldAcervoProps } from '~/core/dto/form-cadastro-acervo';
import { FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

export const FieldsBibliografico: FieldAcervoProps[] = [
  {
    fieldCervo: FieldAcervoEnum.Titulo,
  },
  {
    fieldCervo: FieldAcervoEnum.Subtitulo,
  },
  {
    fieldCervo: FieldAcervoEnum.Material,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Autor,
  },
  {
    fieldCervo: FieldAcervoEnum.Coautor,
  },
  {
    fieldCervo: FieldAcervoEnum.TipoAutoria,
  },
  {
    fieldCervo: FieldAcervoEnum.Editora,
  },
  {
    fieldCervo: FieldAcervoEnum.Assunto,
  },
  {
    fieldCervo: FieldAcervoEnum.Ano,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Edicao,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.NumeroDePaginas,
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
    fieldCervo: FieldAcervoEnum.SerieColecao,
  },
  {
    fieldCervo: FieldAcervoEnum.Volume,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Idioma,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.LocalizacaoCDD,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.LocalizacaoPHA,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.NotasGerais,
  },
  {
    fieldCervo: FieldAcervoEnum.ISBN,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Tombo,
    sm: 12,
  },
];
