import { TipoAcervo } from '../enum/tipo-acervo';
import { TipoAcervoTag } from '../enum/tipo-acervo-tag';

export type PesquisaAcervoDTO = {
  tipo: TipoAcervo;
  titulo: string;
  creditoAutoria: string;
  assunto: string;
  descricao: string;
  editora: string;
  ano: string;
  dataAcervo: string;
  tipoAcervoTag: TipoAcervoTag;
  enderecoImagem: string;
  enderecoImagemPadrao: string;
  codigo: string;
  acervoId: number;
  estaDisponivel: boolean;
  situacaoDisponibilidade: string;
  temControleDisponibilidade: boolean;
};
