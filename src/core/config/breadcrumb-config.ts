import { ROUTES } from '../enum/routes';

export type BreadcrumbRouteConfig = {
  label: string;
  path?: string;
};

export const BREADCRUMB_ROUTES: Record<string, BreadcrumbRouteConfig> = {
  // Principal
  [ROUTES.PRINCIPAL]: {
    label: 'Início',
    path: ROUTES.PRINCIPAL,
  },

  // Meus Dados
  [ROUTES.MEUS_DADOS]: {
    label: 'Meus dados',
    path: ROUTES.MEUS_DADOS,
  },

  // Cadastros
  '/cadastro': {
    label: 'Cadastros',
  },

  // Crédito
  [ROUTES.CREDITO]: {
    label: 'Crédito',
    path: ROUTES.CREDITO,
  },
  '/cadastro/credito/novo': {
    label: 'Novo',
  },
  '/cadastro/credito/editar': {
    label: 'Editar',
  },

  // Autor
  [ROUTES.AUTOR]: {
    label: 'Autor',
    path: ROUTES.AUTOR,
  },
  '/cadastro/autor/novo': {
    label: 'Novo',
  },
  '/cadastro/autor/editar': {
    label: 'Editar',
  },

  // Editora
  [ROUTES.EDITORA]: {
    label: 'Editora',
    path: ROUTES.EDITORA,
  },
  '/cadastro/editora/novo': {
    label: 'Novo',
  },
  '/cadastro/editora/editar': {
    label: 'Editar',
  },

  // Assunto
  [ROUTES.ASSUNTO]: {
    label: 'Assunto',
    path: ROUTES.ASSUNTO,
  },
  '/cadastro/assunto/novo': {
    label: 'Novo',
  },
  '/cadastro/assunto/editar': {
    label: 'Editar',
  },

  // Série/Coleção
  [ROUTES.SERIE_COLECAO]: {
    label: 'Série/Coleção',
    path: ROUTES.SERIE_COLECAO,
  },
  '/cadastro/serie-colecao/novo': {
    label: 'Novo',
  },
  '/cadastro/serie-colecao/editar': {
    label: 'Editar',
  },

  // Acervo
  [ROUTES.ACERVO]: {
    label: 'Acervo',
    path: ROUTES.ACERVO,
  },
  '/cadastro/acervo/novo': {
    label: 'Novo',
  },
  '/cadastro/acervo/editar': {
    label: 'Editar',
  },
  '/cadastro/acervo/importar': {
    label: 'Importar',
  },

  // Operações
  '/acervo': {
    label: 'Operações',
  },

  // Solicitações
  [ROUTES.SOLICITACAO]: {
    label: 'Nova solicitação',
    path: ROUTES.SOLICITACAO,
  },

  // Atendimento de Solicitações
  [ROUTES.ATENDIMENTO_SOLICITACOES]: {
    label: 'Atendimento de solicitações',
    path: ROUTES.ATENDIMENTO_SOLICITACOES,
  },
  '/acervo/atendimento-solicitacoes/editar': {
    label: 'Visualizar',
  },
  '/acervo/atendimento-solicitacoes/solicitacao-manual': {
    label: 'Nova solicitação',
  },

  // Gestão
  [ROUTES.GESTAO]: {
    label: 'Gestão',
  },
  [ROUTES.CALENDARIO]: {
    label: 'Calendário',
    path: ROUTES.CALENDARIO,
  },

  // Relatórios
  [ROUTES.RELATORIOS]: {
    label: 'Relatórios',
  },
  [ROUTES.LIVROS_EMPRESTADOS]: {
    label: 'Controle de livros emprestados',
    path: ROUTES.LIVROS_EMPRESTADOS,
  },
  [ROUTES.TOMBO_CODIGO]: {
    label: 'Controle de tombo/código',
    path: ROUTES.TOMBO_CODIGO,
  },
  [ROUTES.AUTOR_CREDITO]: {
    label: 'Controle por autor/crédito',
    path: ROUTES.AUTOR_CREDITO,
  },
  [ROUTES.RELATORIO_EDITORA]: {
    label: 'Controle por editora',
    path: ROUTES.RELATORIO_EDITORA,
  },
  [ROUTES.RELATORIO_DEVOLUCAO_LIVRO]: {
    label: 'Controle de devolução de livros',
    path: ROUTES.RELATORIO_DEVOLUCAO_LIVRO,
  },
  [ROUTES.RELATORIO_DOWNLOAD_ACERVOS]: {
    label: 'Controle de download de acervos',
    path: ROUTES.RELATORIO_DOWNLOAD_ACERVOS,
  },
  [ROUTES.TITULOS_MAIS_PESQUISADOS]: {
    label: 'Títulos mais pesquisados',
    path: ROUTES.TITULOS_MAIS_PESQUISADOS,
  },
};
