import { FieldAcervoProps } from '~/core/dto/form-cadastro-acervo';
import { FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

export const FieldsAudiovisual: FieldAcervoProps[] = [
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
    fieldAcervo: FieldAcervoEnum.AutorizacaoUsoImagem,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.EstadoConservacao,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Descricao,
  },
  {
    fieldAcervo: FieldAcervoEnum.Suporte,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Copia,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Duracao,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Cromia,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.TamanhoArquivo,
    sm: 12,
  },
  {
    fieldAcervo: FieldAcervoEnum.Acessibilidade,
  },
  {
    fieldAcervo: FieldAcervoEnum.Disponibilizacao,
  },
  { fieldAcervo: FieldAcervoEnum.SituacaoAcervo, sm: 12 },
];
