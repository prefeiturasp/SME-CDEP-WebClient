import { FieldAcervoProps } from '~/core/dto/form-cadastro-acervo';
import { FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

export const FieldsAudioVisual: FieldAcervoProps[] = [
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
    fieldCervo: FieldAcervoEnum.Copia,
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
    fieldCervo: FieldAcervoEnum.Descricao,
  },
  {
    fieldCervo: FieldAcervoEnum.Suporte,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Duracao,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Cromia,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.TamanhoArquivo,
    sm: 12,
  },
  {
    fieldCervo: FieldAcervoEnum.Acessibilidade,
  },
  {
    fieldCervo: FieldAcervoEnum.Disponibilizacao,
  },
];
