import { TipoAcervo } from '../enum/tipo-acervo';

export interface AcervoSolicitacaoItemRetornoDTO {
  id: number;
  titulo: string;
  acervoId: number;
  tipoAcervo: string;
  tipoAcervoId: TipoAcervo;
  autoresCreditos: string[];
  situacaoDisponibilidade: string;
  estaDisponivel: boolean;
  temControleDisponibilidade: boolean;
}
