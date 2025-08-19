export enum FieldAcervoEnum {
  Titulo = 1,
  Tombo,
  Credito,
  Localizacao,
  Procedencia,
  DataAcervo,
  CopiaDigital,
  AutorizacaoUsoImagem,
  EstadoConservacao,
  Descricao,
  Quantidade,
  DimensaoLargura,
  DimensaoAltura,
  Suporte,
  FormatoImagem,
  TamanhoArquivo,
  Cromia,
  Resolucao,
  Anexos,
  Tecnica,
  DimensaoDiametro,
  DimensaoProfundidade,
  Duracao,
  Copia,
  Acessibilidade,
  Disponibilizacao,
  Material,
  Idioma,
  Autor,
  Ano,
  NumeroDePaginas,
  Volume,
  TipoDeAnexo,
  AcessoDocumento,
  Subtitulo,
  Coautor,
  TipoAutoria,
  Editora,
  Assunto,
  Edicao,
  SerieColecao,
  LocalizacaoCDD,
  LocalizacaoPHA,
  NotasGerais,
  ISBN,
  CodigoAntigo,
  CodigoNovo,
  Dimensoes,
  LocalizacaoCDDPHA,
  AcervoDisponivel,
  SituacaoAcervo,
  ImagemCapa,
}

type FieldAcervoNameLabelType = {
  name: string;
  label: string;
};

type FieldAcervoNameLabelProps = {
  Titulo: FieldAcervoNameLabelType;
  Tombo: FieldAcervoNameLabelType;
  Credito: FieldAcervoNameLabelType;
  Localizacao: FieldAcervoNameLabelType;
  Procedencia: FieldAcervoNameLabelType;
  DataAcervo: FieldAcervoNameLabelType;
  CopiaDigital: FieldAcervoNameLabelType;
  AutorizacaoUsoImagem: FieldAcervoNameLabelType;
  EstadoConservacao: FieldAcervoNameLabelType;
  Descricao: FieldAcervoNameLabelType;
  Quantidade: FieldAcervoNameLabelType;
  DimensaoLargura: FieldAcervoNameLabelType;
  DimensaoAltura: FieldAcervoNameLabelType;
  Suporte: FieldAcervoNameLabelType;
  FormatoImagem: FieldAcervoNameLabelType;
  TamanhoArquivo: FieldAcervoNameLabelType;
  Cromia: FieldAcervoNameLabelType;
  Resolucao: FieldAcervoNameLabelType;
  Anexos: FieldAcervoNameLabelType;
  Tecnica: FieldAcervoNameLabelType;
  DimensaoDiametro: FieldAcervoNameLabelType;
  DimensaoProfundidade: FieldAcervoNameLabelType;
  Duracao: FieldAcervoNameLabelType;
  Copia: FieldAcervoNameLabelType;
  Acessibilidade: FieldAcervoNameLabelType;
  Disponibilizacao: FieldAcervoNameLabelType;
  Material: FieldAcervoNameLabelType;
  Idioma: FieldAcervoNameLabelType;
  Autor: FieldAcervoNameLabelType;
  Ano: FieldAcervoNameLabelType;
  NumeroDePaginas: FieldAcervoNameLabelType;
  Volume: FieldAcervoNameLabelType;
  TipoDeAnexo: FieldAcervoNameLabelType;
  AcessoDocumento: FieldAcervoNameLabelType;
  Subtitulo: FieldAcervoNameLabelType;
  Coautor: FieldAcervoNameLabelType;
  TipoAutoria: FieldAcervoNameLabelType;
  Editora: FieldAcervoNameLabelType;
  Assunto: FieldAcervoNameLabelType;
  Edicao: FieldAcervoNameLabelType;
  SerieColecao: FieldAcervoNameLabelType;
  LocalizacaoCDD: FieldAcervoNameLabelType;
  LocalizacaoPHA: FieldAcervoNameLabelType;
  NotasGerais: FieldAcervoNameLabelType;
  ISBN: FieldAcervoNameLabelType;
  CodigoAntigo: FieldAcervoNameLabelType;
  CodigoNovo: FieldAcervoNameLabelType;
  Dimensoes: FieldAcervoNameLabelType;
  LocalizacaoCDDPHA: FieldAcervoNameLabelType;
  AcervoDisponivel: FieldAcervoNameLabelType;
  SituacaoAcervo: FieldAcervoNameLabelType;
  ImagemCapa: FieldAcervoNameLabelType;
};

const FieldAcervoNameLabel: FieldAcervoNameLabelProps = {
  Titulo: {
    name: 'titulo',
    label: 'Título',
  },
  Tombo: {
    name: 'codigo',
    label: 'Tombo',
  },
  Credito: {
    name: 'creditosAutoresIds',
    label: 'Crédito',
  },
  Localizacao: {
    name: 'localizacao',
    label: 'Localização',
  },
  Procedencia: {
    name: 'procedencia',
    label: 'Procedência',
  },
  DataAcervo: {
    name: 'dataAcervo',
    label: 'Data',
  },
  CopiaDigital: {
    name: 'copiaDigital',
    label: 'Cópia digital',
  },
  AutorizacaoUsoImagem: {
    name: 'permiteUsoImagem',
    label: 'Autorização do uso de imagem',
  },
  EstadoConservacao: {
    name: 'conservacaoId',
    label: 'Estado de conservação',
  },
  Descricao: {
    name: 'descricao',
    label: 'Descrição',
  },
  Quantidade: {
    name: 'quantidade',
    label: 'Quantidade',
  },
  DimensaoLargura: {
    name: 'largura',
    label: 'Dimensão largura (cm)',
  },
  DimensaoAltura: {
    name: 'altura',
    label: 'Dimensão altura (cm)',
  },
  Suporte: {
    name: 'suporteId',
    label: 'Suporte',
  },
  FormatoImagem: {
    name: 'formatoId',
    label: 'Formato da imagem',
  },
  TamanhoArquivo: {
    name: 'tamanhoArquivo',
    label: 'Tamanho do arquivo',
  },
  Cromia: {
    name: 'cromiaId',
    label: 'Cromia',
  },
  Resolucao: {
    name: 'resolucao',
    label: 'Resolução',
  },
  Anexos: {
    name: 'arquivos',
    label: 'Anexo',
  },
  Tecnica: {
    name: 'tecnica',
    label: 'Técnica',
  },
  DimensaoDiametro: {
    name: 'diametro',
    label: 'Dimensão diâmetro (cm)',
  },
  DimensaoProfundidade: {
    name: 'profundidade',
    label: 'Dimensão profundidade (cm)',
  },
  Duracao: {
    name: 'duracao',
    label: 'Duração',
  },
  Copia: {
    name: 'copia',
    label: 'Cópia',
  },
  Acessibilidade: {
    name: 'acessibilidade',
    label: 'Acessibilidade',
  },
  Disponibilizacao: {
    name: 'disponibilizacao',
    label: 'Disponibilização',
  },
  Material: {
    name: 'materialId',
    label: 'Material',
  },
  Idioma: {
    name: 'idiomaId',
    label: 'Idioma',
  },
  Autor: {
    name: 'creditosAutoresIds',
    label: 'Autor',
  },
  Ano: {
    name: 'ano',
    label: 'Ano',
  },
  NumeroDePaginas: {
    name: 'numeroPagina',
    label: 'Número de páginas',
  },
  Volume: {
    name: 'volume',
    label: 'Volume',
  },
  TipoDeAnexo: {
    name: 'tipoAnexo',
    label: 'Tipo de anexo',
  },
  AcessoDocumento: {
    name: 'acessoDocumentosIds',
    label: 'Acesso do documento',
  },
  Subtitulo: {
    name: 'subTitulo',
    label: 'Subtítulo',
  },
  Coautor: {
    name: 'coAutores',
    label: 'Coautor',
  },
  TipoAutoria: {
    name: 'tipoAutoria',
    label: 'Tipo de autoria',
  },
  Editora: {
    name: 'editoraId',
    label: 'Editora',
  },
  Assunto: {
    name: 'assuntosIds',
    label: 'Assunto',
  },
  Edicao: {
    name: 'edicao',
    label: 'Edição',
  },
  SerieColecao: {
    name: 'serieColecaoId',
    label: 'Série/Coleção',
  },
  LocalizacaoCDD: {
    name: 'localizacaoCDD',
    label: 'Localização CDD',
  },
  LocalizacaoPHA: {
    name: 'localizacaoPHA',
    label: 'Localização PHA',
  },
  NotasGerais: {
    name: 'notasGerais',
    label: 'Notas Gerais',
  },
  ISBN: {
    name: 'isbn',
    label: 'ISBN',
  },
  CodigoAntigo: {
    name: 'codigo',
    label: 'Código antigo',
  },
  CodigoNovo: {
    name: 'codigoNovo',
    label: 'Código atual',
  },
  Dimensoes: {
    name: 'dimensoes',
    label: 'Dimensões (cm)',
  },
  LocalizacaoCDDPHA: {
    name: 'localizacao',
    label: 'Localização',
  },
  AcervoDisponivel: {
    name: 'situacaoSaldo',
    label: 'Acervo disponível',
  },
  SituacaoAcervo: {
    name: 'situacaoAcervo',
    label: 'Situação do Acervo',
  },
  ImagemCapa: {
    name: 'capaDocumento',
    label: 'Adicionar capa',
  }
};

export const FieldAcervoEnumByName: Record<string, FieldAcervoEnum> = {
  [FieldAcervoNameLabel.Titulo.name]: FieldAcervoEnum.Titulo,
};

export const PropsByFieldAcervoEnum: Record<FieldAcervoEnum, FieldAcervoNameLabelType> = {
  [FieldAcervoEnum.Titulo]: FieldAcervoNameLabel.Titulo,
  [FieldAcervoEnum.Tombo]: FieldAcervoNameLabel.Tombo,
  [FieldAcervoEnum.Credito]: FieldAcervoNameLabel.Credito,
  [FieldAcervoEnum.Localizacao]: FieldAcervoNameLabel.Localizacao,
  [FieldAcervoEnum.Procedencia]: FieldAcervoNameLabel.Procedencia,
  [FieldAcervoEnum.DataAcervo]: FieldAcervoNameLabel.DataAcervo,
  [FieldAcervoEnum.CopiaDigital]: FieldAcervoNameLabel.CopiaDigital,
  [FieldAcervoEnum.AutorizacaoUsoImagem]: FieldAcervoNameLabel.AutorizacaoUsoImagem,
  [FieldAcervoEnum.EstadoConservacao]: FieldAcervoNameLabel.EstadoConservacao,
  [FieldAcervoEnum.Descricao]: FieldAcervoNameLabel.Descricao,
  [FieldAcervoEnum.Quantidade]: FieldAcervoNameLabel.Quantidade,
  [FieldAcervoEnum.DimensaoLargura]: FieldAcervoNameLabel.DimensaoLargura,
  [FieldAcervoEnum.DimensaoAltura]: FieldAcervoNameLabel.DimensaoAltura,
  [FieldAcervoEnum.Suporte]: FieldAcervoNameLabel.Suporte,
  [FieldAcervoEnum.FormatoImagem]: FieldAcervoNameLabel.FormatoImagem,
  [FieldAcervoEnum.TamanhoArquivo]: FieldAcervoNameLabel.TamanhoArquivo,
  [FieldAcervoEnum.Cromia]: FieldAcervoNameLabel.Cromia,
  [FieldAcervoEnum.Resolucao]: FieldAcervoNameLabel.Resolucao,
  [FieldAcervoEnum.Anexos]: FieldAcervoNameLabel.Anexos,
  [FieldAcervoEnum.Tecnica]: FieldAcervoNameLabel.Tecnica,
  [FieldAcervoEnum.DimensaoDiametro]: FieldAcervoNameLabel.DimensaoDiametro,
  [FieldAcervoEnum.DimensaoProfundidade]: FieldAcervoNameLabel.DimensaoProfundidade,
  [FieldAcervoEnum.Duracao]: FieldAcervoNameLabel.Duracao,
  [FieldAcervoEnum.Copia]: FieldAcervoNameLabel.Copia,
  [FieldAcervoEnum.Acessibilidade]: FieldAcervoNameLabel.Acessibilidade,
  [FieldAcervoEnum.Disponibilizacao]: FieldAcervoNameLabel.Disponibilizacao,
  [FieldAcervoEnum.Material]: FieldAcervoNameLabel.Material,
  [FieldAcervoEnum.Idioma]: FieldAcervoNameLabel.Idioma,
  [FieldAcervoEnum.Autor]: FieldAcervoNameLabel.Autor,
  [FieldAcervoEnum.Ano]: FieldAcervoNameLabel.Ano,
  [FieldAcervoEnum.NumeroDePaginas]: FieldAcervoNameLabel.NumeroDePaginas,
  [FieldAcervoEnum.Volume]: FieldAcervoNameLabel.Volume,
  [FieldAcervoEnum.TipoDeAnexo]: FieldAcervoNameLabel.TipoDeAnexo,
  [FieldAcervoEnum.AcessoDocumento]: FieldAcervoNameLabel.AcessoDocumento,
  [FieldAcervoEnum.Subtitulo]: FieldAcervoNameLabel.Subtitulo,
  [FieldAcervoEnum.Coautor]: FieldAcervoNameLabel.Coautor,
  [FieldAcervoEnum.TipoAutoria]: FieldAcervoNameLabel.TipoAutoria,
  [FieldAcervoEnum.Editora]: FieldAcervoNameLabel.Editora,
  [FieldAcervoEnum.Assunto]: FieldAcervoNameLabel.Assunto,
  [FieldAcervoEnum.Edicao]: FieldAcervoNameLabel.Edicao,
  [FieldAcervoEnum.SerieColecao]: FieldAcervoNameLabel.SerieColecao,
  [FieldAcervoEnum.LocalizacaoCDD]: FieldAcervoNameLabel.LocalizacaoCDD,
  [FieldAcervoEnum.LocalizacaoPHA]: FieldAcervoNameLabel.LocalizacaoPHA,
  [FieldAcervoEnum.NotasGerais]: FieldAcervoNameLabel.NotasGerais,
  [FieldAcervoEnum.ISBN]: FieldAcervoNameLabel.ISBN,
  [FieldAcervoEnum.CodigoAntigo]: FieldAcervoNameLabel.CodigoAntigo,
  [FieldAcervoEnum.CodigoNovo]: FieldAcervoNameLabel.CodigoNovo,
  [FieldAcervoEnum.Dimensoes]: FieldAcervoNameLabel.Dimensoes,
  [FieldAcervoEnum.LocalizacaoCDDPHA]: FieldAcervoNameLabel.LocalizacaoCDDPHA,
  [FieldAcervoEnum.AcervoDisponivel]: FieldAcervoNameLabel.AcervoDisponivel,
  [FieldAcervoEnum.SituacaoAcervo]: FieldAcervoNameLabel.SituacaoAcervo,
  [FieldAcervoEnum.ImagemCapa]: FieldAcervoNameLabel.ImagemCapa,
};
