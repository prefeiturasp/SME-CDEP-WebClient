import { FieldAcervoProps } from '~/core/dto/form-cadastro-acervo';
import { FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

export const FieldsDocumentacaoHistorica: FieldAcervoProps[] = [
  {
    fieldAcervo: FieldAcervoEnum.Titulo,
  },
  {
    fieldAcervo: FieldAcervoEnum.CodigoAntigoNovo,
  },
  {
    fieldAcervo: FieldAcervoEnum.Material,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Idioma,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Autor,
  },
  {
    fieldAcervo: FieldAcervoEnum.Ano,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.NumeroDePaginas,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Volume,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Descricao,
  },
  {
    fieldAcervo: FieldAcervoEnum.TipoDeAnexo,
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
    fieldAcervo: FieldAcervoEnum.TamanhoArquivo,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.AcessoDocumento,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Localizacao,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.CopiaDigital,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.EstadoConservacao,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Anexos,
  },
];
