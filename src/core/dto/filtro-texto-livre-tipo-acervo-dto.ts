import { TipoAcervo } from '../enum/tipo-acervo';

export type FiltroTextoLivreTipoAcervoDTO = {
  tipoAcervo?: TipoAcervo;
  textoLivre: string;
  anoInicial?: string;
  anoFinal?: string;
};
