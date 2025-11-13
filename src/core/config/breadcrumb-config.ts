import { ROUTES } from '../enum/routes';

export type BreadcrumbRouteConfig = {
  label: string;
  path?: string;
};

// Mapeamento de rotas para labels do breadcrumb
export const BREADCRUMB_ROUTES: Record<string, BreadcrumbRouteConfig> = {
  // Principal
  [ROUTES.PRINCIPAL]: {
    label: 'Início',
    path: ROUTES.PRINCIPAL,
  },

  // Meus Dados
  [ROUTES.MEUS_DADOS]: {
    label: 'Meus Dados',
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

  // Solicitações
  '/acervo': {
    label: 'Acervo',
  },
  [ROUTES.SOLICITACAO]: {
    label: 'Solicitação',
    path: ROUTES.SOLICITACAO,
  },
  '/acervo/solicitacao/novo': {
    label: 'Nova Solicitação',
  },

  // Atendimento de Solicitações
  [ROUTES.ATENDIMENTO_SOLICITACOES]: {
    label: 'Atendimento de Solicitações',
    path: ROUTES.ATENDIMENTO_SOLICITACOES,
  },
  '/atendimento-solicitacoes/editar': {
    label: 'Atender',
  },
  '/atendimento-solicitacoes/solicitacao-manual': {
    label: 'Solicitação Manual',
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
    label: 'Livros Emprestados',
    path: ROUTES.LIVROS_EMPRESTADOS,
  },
  [ROUTES.TOMBO_CODIGO]: {
    label: 'Tombo/Código',
    path: ROUTES.TOMBO_CODIGO,
  },
  [ROUTES.AUTOR_CREDITO]: {
    label: 'Autor/Crédito',
    path: ROUTES.AUTOR_CREDITO,
  },
  [ROUTES.RELATORIO_EDITORA]: {
    label: 'Editora',
    path: ROUTES.RELATORIO_EDITORA,
  },
  [ROUTES.RELATORIO_DEVOLUCAO_LIVRO]: {
    label: 'Devolução de Livros',
    path: ROUTES.RELATORIO_DEVOLUCAO_LIVRO,
  },
  [ROUTES.RELATORIO_DOWNLOAD_ACERVOS]: {
    label: 'Download de Acervos',
    path: ROUTES.RELATORIO_DOWNLOAD_ACERVOS,
  },
  [ROUTES.TITULOS_MAIS_PESQUISADOS]: {
    label: 'Títulos Mais Pesquisados',
    path: ROUTES.TITULOS_MAIS_PESQUISADOS,
  },
};
