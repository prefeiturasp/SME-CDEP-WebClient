export type DetalhesSolicitacaoDTO = {
    id?: number | null;
    usuarioId?: number | null;
    dadosSolicitante?: DadosSolicitantesDTO;
    dataSolicitacao?: string | null;
    responsavel?: string | null;
    situacao?: string  | null;
    itens?: ItensDetalhesSolicitacaoDTO[];
    acervo?: string | null;
  };
  
  type DadosSolicitantesDTO = {
    nome?: string | null;
    cpf?: string | null;
    telefone?: string | null;
    endereco?: string | null;
    email?: string | null;
    tipo?: string | null;
  }

  type ItensDetalhesSolicitacaoDTO = {
    id?: number | null;
    codigo?: string | null;
    tipoAcervo?: string | null;
    titulo?: string | null;
    situacao?: string | null;
    dataVisita?: string | null;
  }