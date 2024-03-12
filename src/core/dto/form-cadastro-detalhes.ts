import { ReactImageGalleryItem } from 'react-image-gallery';
import { FieldAcervoEnum } from '../enum/field-acervo-enum';
import { TipoAcervo } from '../enum/tipo-acervo';

export type ConsultaAcervoDetalhesDTO = {
  titulo: string;
  subTitulo: string;
  codigo: string;
  codigoNovo: string;
  creditosAutores: string;
  material: string;
  idioma: string;
  editora: string;
  serieColecao: string;
  assuntos: string;
  ano: string;
  tipoAutoria: string;
  edicao: string;
  numeroPagina: string;
  volume: string;
  tipoAnexo: string;
  acessosDocumentos: string;
  localizacao: string;
  localizacaoCDD: string;
  localizacaoPHA: string;
  notasGerais: string;
  isbn: string;
  procedencia: string;
  dataAcervo: string;
  copiaDigital: string;
  copia: string;
  permiteUsoImagem: string;
  conservacao: string;
  descricao: string;
  duracao: string;
  quantidade: string;
  dimensoes: string;
  tecnica: string;
  suporte: string;
  formato: string;
  tamanhoArquivo: string;
  cromia: string;
  resolucao: string;
  acessibilidade: string;
  disponibilizacao: string;
  imagens: ReactImageGalleryItem[];
  enderecoImagemPadrao: string;
  estaDisponivel: boolean;
  situacaoDisponibilidade: string;
  temControleDisponibilidade: boolean;
  tipoAcervoId?: TipoAcervo;
};

export type FieldAcervoDetalhesProps = {
  fieldAcervo: FieldAcervoEnum;
  ellipsis?: boolean;
};
