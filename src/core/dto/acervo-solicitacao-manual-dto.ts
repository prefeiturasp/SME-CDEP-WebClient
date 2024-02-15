export type AcervoSolicitacaoManualDTO = {
  id: number | undefined;
  codigo: string | undefined;
  titulo: string | undefined;
  situacao: string;
  dataVisita?: string;
  tipoAtendimento: string;
};
