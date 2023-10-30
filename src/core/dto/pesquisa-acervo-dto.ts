import { SetStateAction } from 'react';
import { TipoAcervo } from '../enum/tipo-acervo';
import { TipoAcervoTag } from '../enum/tipo-acervo-tag';

type BasePesquisaAcervoDTO = {
  items: SetStateAction<PesquisaAcervoDTO[]>;
};

export type PesquisaAcervoDTO = {
  tipo: TipoAcervo;
  titulo: string;
  creditoAutoria: string;
  assunto: string;
  descricao: string;
  data: string;
  tipoAcervoTag: TipoAcervoTag;
  enderecoImagem: string;
} & BasePesquisaAcervoDTO;
