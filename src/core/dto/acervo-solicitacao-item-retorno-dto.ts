export interface AcervoSolicitacaoItemRetornoDTO {
  id: number;
  titulo: string;
  acervoId: number;
  tipoAcervo: string;
  autoresCreditos: string[];
  situacaoDisponibilidade: string;
  estaDisponivel: boolean;
}
