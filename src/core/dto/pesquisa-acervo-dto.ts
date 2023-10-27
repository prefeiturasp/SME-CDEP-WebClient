import { TipoAcervo } from '../enum/tipo-acervo';
import { TipoAcervoTag } from '../enum/tipo-acervo-tag';

export type PesquisaAcervoDTO = {
  id: number;
  tipoAcervoId: TipoAcervo;
  titulo: string;
  creditoAutoria: string;
  assunto: string;
  descricao: string;
  data: string;
  tipoAcervoTag: TipoAcervoTag;
  enderecoImagem: string;
};
