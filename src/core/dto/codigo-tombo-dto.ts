export type CodigoTomboDTO = {
  id: number;
  nome: string;
  codigo: string;
  tipo?: number;
  estaDisponivel?: boolean;
  situacaoDisponibilidade?: string;
  temControleDisponibilidade?: boolean;
};
