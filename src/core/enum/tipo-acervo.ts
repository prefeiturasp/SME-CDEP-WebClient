export enum TipoAcervo {
  Bibliografico = 1,
  DocumentacaoTextual = 2,
  ArtesGraficas = 3,
  Audiovisual = 4,
  Fotografico = 5,
  Tridimensional = 6,
}

export const TipoAcervoDisplay: Record<TipoAcervo, string> = {
  [TipoAcervo.Bibliografico]: 'Bibliográfico',
  [TipoAcervo.DocumentacaoTextual]: 'Documentação histórica',
  [TipoAcervo.ArtesGraficas]: 'Artes gráficas',
  [TipoAcervo.Audiovisual]: 'Audiovisual',
  [TipoAcervo.Fotografico]: 'Fotográfico',
  [TipoAcervo.Tridimensional]: 'Tridimensional',
};

export const TipoAcervoSuffix: Record<TipoAcervo, string> = {
  [TipoAcervo.Bibliografico]: '',
  [TipoAcervo.DocumentacaoTextual]: '',
  [TipoAcervo.ArtesGraficas]: '.AG',
  [TipoAcervo.Audiovisual]: '.AV',
  [TipoAcervo.Fotografico]: '.FT',
  [TipoAcervo.Tridimensional]: '.TD',
};

export const TipoAcervoPlanilhaModelo: Record<TipoAcervo, string> = {
  [TipoAcervo.Bibliografico]: 'planilha_acervo_bibliografico.xlsx',
  [TipoAcervo.DocumentacaoTextual]: 'planilha_acervo_documental.xlsx',
  [TipoAcervo.ArtesGraficas]: 'planilha_acervo_arte_grafica.xlsx',
  [TipoAcervo.Audiovisual]: 'planilha_acervo_audiovisual.xlsx',
  [TipoAcervo.Fotografico]: 'planilha_acervo_fotografico.xlsx',
  [TipoAcervo.Tridimensional]: 'planilha_acervo_tridimensional.xlsx',
};
