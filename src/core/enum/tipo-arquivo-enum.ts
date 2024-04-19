export enum TipoArquivo {
  Temp = 1,
  Editor = 2,
  AcervoFotografico = 3,
  AcervoArteGrafica = 4,
  AcervoTridimensional = 5,
  AcervoDocumental = 6,
  Sistema = 7,
}

export const TipoArquivoDisplay: Record<TipoArquivo, string> = {
  [TipoArquivo.Temp]: 'temp',
  [TipoArquivo.Editor]: 'temp',
  [TipoArquivo.AcervoFotografico]: 'acervo-fotografico',
  [TipoArquivo.AcervoArteGrafica]: 'acervo-arte-grafica',
  [TipoArquivo.AcervoTridimensional]: 'acervo-tridimensional',
  [TipoArquivo.AcervoDocumental]: 'acervo-documental',
  [TipoArquivo.Sistema]: 'sistema',
};
