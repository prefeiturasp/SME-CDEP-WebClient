export enum TipoAcervo {
  Bibliografico = 1,
  DocumentacaoHistorica = 2,
  ArtesGraficas = 3,
  Audiovisual = 4,
  Fotografico = 5,
  Tridimensional = 6,
}

export const TipoAcervoDisplay: Record<TipoAcervo, string> = {
  [TipoAcervo.Bibliografico]: 'Bibliográfico',
  [TipoAcervo.DocumentacaoHistorica]: 'Documentação histórica',
  [TipoAcervo.ArtesGraficas]: 'Artes gráficas',
  [TipoAcervo.Audiovisual]: 'Audiovisual',
  [TipoAcervo.Fotografico]: 'Fotográfico',
  [TipoAcervo.Tridimensional]: 'Tridimensional',
};
