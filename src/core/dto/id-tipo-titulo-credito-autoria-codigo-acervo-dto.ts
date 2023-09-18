import { TipoAcervo } from '../enum/tipo-acervo';

export type IdTipoTituloCreditoAutoriaCodigoAcervoDTO = {
  acervoId: number;
  tipoAcervo: string;
  tipoAcervoId: TipoAcervo;
  titulo: string;
  creditoAutoria: string;
  codigo: string;
};
