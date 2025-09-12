import { TipoAcervo } from '../enum/tipo-acervo';

export type AcervoTableRow = {
  acervoId: number;
  tipoAcervo: string;
  tipoAcervoId: TipoAcervo;
  titulo: string;
  creditoAutoria: string;
  codigo: string;
  capaDocumento?: string;
};
