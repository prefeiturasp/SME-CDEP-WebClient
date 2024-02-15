export enum ROUTES {
  PRINCIPAL = '/',
  LOGIN = '/login',
  CRIAR_CONTA = '/criar-conta',
  MEUS_DADOS = '/meus-dados',
  REDEFINIR_SENHA = '/redefinir-senha',
  REDEFINIR_SENHA_TOKEN = '/redefinir-senha/:token',
  CADASTRO = '/cadastro',
  CREDITO = '/cadastro/credito',
  CREDITO_NOVO = '/cadastro/credito/novo',
  CREDITO_EDITAR = '/cadastro/credito/editar/:id',
  AUTOR = '/cadastro/autor',
  AUTOR_NOVO = '/cadastro/autor/novo',
  AUTOR_EDITAR = '/cadastro/autor/editar/:id',
  EDITORA = '/cadastro/editora',
  EDITORA_NOVO = '/cadastro/editora/novo',
  EDITORA_EDITAR = '/cadastro/editora/editar/:id',
  ASSUNTO = '/cadastro/assunto',
  ASSUNTO_NOVO = '/cadastro/assunto/novo',
  ASSUNTO_EDITAR = '/cadastro/assunto/editar/:id',
  SERIE_COLECAO = '/cadastro/serie-colecao',
  SERIE_COLECAO_NOVO = '/cadastro/serie-colecao/novo',
  SERIE_COLECAO_EDITAR = '/cadastro/serie-colecao/editar/:id',
  MATERIAL = '/cadastro/material',
  MATERIAL_NOVO = '/cadastro/material/novo',
  MATERIAL_EDITAR = '/cadastro/material/editar/:id',
  IDIOMA = '/cadastro/idioma',
  IDIOMA_NOVO = '/cadastro/idioma/novo',
  IDIOMA_EDITAR = '/cadastro/idioma/editar/:id',
  ACERVO = '/cadastro/acervo',
  ACERVO_NOVO = '/cadastro/acervo/novo',
  ACERVO_EDITAR = '/cadastro/acervo/editar/:id',
  CONSULTA_ACERVO = '/consulta-acervo',
  CONSULTA_ACERVO_DETALHES = '/consulta-acervo/detalhes',
  ACERVO_IMPORTAR = '/cadastro/acervo/importar',
  SEM_PERMISSAO = '/sem-permissao',
  SOLICITACAO = '/acervo/solicitacao',
  SOLICITACAO_EDITAR = '/acervo/solicitacao/:id',
  ATENDIMENTO_SOLICITACOES = '/atendimento-solicitacoes',
  ATENDIMENTO_SOLICITACOES_EDITAR = '/atendimento-solicitacoes/:id',
  ATENDIMENTO_SOLICITACAO_MANUAL = '/atendimento-solicitacoes/solicitacao-manual',
}
