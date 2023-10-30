export enum TipoAcervoTag {
  Biblioteca = 1,
  MemoriaDocumental = 2,
  MemoriaEducacaoMunicipal = 3,
}

export const TipoAcervoTagDisplay: Record<TipoAcervoTag, string> = {
  [TipoAcervoTag.Biblioteca]: 'Biblioteca',
  [TipoAcervoTag.MemoriaDocumental]: 'Memória Documental',
  [TipoAcervoTag.MemoriaEducacaoMunicipal]: 'Memória Documental',
};
