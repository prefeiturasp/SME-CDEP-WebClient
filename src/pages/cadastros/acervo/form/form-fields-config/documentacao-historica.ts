import { FieldAcervoProps } from '~/core/dto/form-cadastro-acervo';
import { FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

export const FieldsDocumentacaoHistorica: FieldAcervoProps[] = [
  {
    fieldCervo: FieldAcervoEnum.Titulo,
  },
  {
    fieldCervo: FieldAcervoEnum.CodigoAntigoNovo,
  },
  {
    fieldCervo: FieldAcervoEnum.Material,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Idioma,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Autor,
  },
  {
    fieldCervo: FieldAcervoEnum.Ano,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.NumeroDePaginas,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Volume,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Descricao,
  },
  {
    fieldCervo: FieldAcervoEnum.TipoDeAnexo,
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
    fieldCervo: FieldAcervoEnum.TamanhoArquivo,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.AcessoDocumento,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Localizacao,
  },
  {
    fieldCervo: FieldAcervoEnum.CopiaDigital,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.EstadoConservacao,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Anexos,
  },
];
