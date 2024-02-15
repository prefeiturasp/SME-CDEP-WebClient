export type AcervoSolicitacaoManualDTO = {
  id: number | undefined;
  codigoTombo: string | undefined;
  titulo: string | undefined;
  situacao: string;
  dataVisita?: string;
  tipoAtendimento: string;
};
