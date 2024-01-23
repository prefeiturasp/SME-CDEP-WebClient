import { TipoAcervo } from '../enum/tipo-acervo';
import { TipoAcervoTag } from '../enum/tipo-acervo-tag';

export type PesquisaAcervoDTO = {
  tipo: TipoAcervo;
  titulo: string;
  creditoAutoria: string;
  assunto: string;
  descricao: string;
  ano: string;
  dataAcervo: string;
  tipoAcervoTag: TipoAcervoTag;
  enderecoImagem: string;
  codigo: string;
  acervoId: number;
};
