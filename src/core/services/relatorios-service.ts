import { AxiosResponse } from 'axios';
import api from './api';

const URL_DEFAULT = '/v1/relatorios';

export type RelatorioControleLivrosEmprestadosRequest = {
  solicitante?: string;
  tombo?: string;
  situacaoSolicitacaoItem?: number;
  situacaoEmprestimo?: string | null;
  modelo: number;
  somenteDevolvidos?: boolean;
};

export type RelatorioControleAcervoRequest = {
  situacaoAcervo: string;
  tipoAcervo: string;
};

export type RelatorioControleAcervoAutorRequest = {
  autores: string;
  tipoAcervo: string;
};

export type RelatorioControleEditoraRequest = {
  editoraId: string;
};

export type RelatorioControleDevolucaoLivrosRequest = {
  solicitante?: string;
  somenteEmAtraso: boolean;
};

export type RelatorioTitulosMaisPesquisadosRequest = {
  dataInicio: any;
  dataFim: any;
  tipoAcervos: any;
};

export type RelatorioDownloadAcervoRequest = {
  TipoAcervo: string;
  Titulo: string;
};

const gerarRelatorioControleLivrosEmprestados = (
  dados: RelatorioControleLivrosEmprestadosRequest,
): Promise<AxiosResponse<Blob>> =>
  api.post(`${URL_DEFAULT}/controle-livros-emprestados`, dados, {
    responseType: 'blob',
  });

const gerarRelatorioControleAcervo = (
  dados: RelatorioControleAcervoRequest,
): Promise<AxiosResponse<Blob>> =>
  api.post(`${URL_DEFAULT}/controle-acervo`, dados, {
    responseType: 'blob',
  });

const gerarRelatorioControleAcervoPorAutor = (
  dados: RelatorioControleAcervoAutorRequest,
): Promise<AxiosResponse<Blob>> =>
  api.post(`${URL_DEFAULT}/controle-acervo-autor`, dados, {
    responseType: 'blob',
  });

const gerarRelatorioControleEditora = (
  dados: RelatorioControleEditoraRequest,
): Promise<AxiosResponse<Blob>> =>
  api.post(`${URL_DEFAULT}/controle-editora`, dados, {
    responseType: 'blob',
  });

const gerarRelatorioControleDevolucaoLivros = (
  dados: RelatorioControleDevolucaoLivrosRequest,
): Promise<AxiosResponse<Blob>> =>
  api.post(`${URL_DEFAULT}/controle-devolucao-livros`, dados, {
    responseType: 'blob',
  });

const gerarRelatorioTitulosMaisPesquisados = (
  dados: RelatorioTitulosMaisPesquisadosRequest,
): Promise<AxiosResponse<Blob>> =>
  api.post(`${URL_DEFAULT}/titulos-mais-pesquisados`, dados, {
    responseType: 'blob',
  });

const gerarRelatorioDownloadAcervos = (
  dados: RelatorioDownloadAcervoRequest,
): Promise<AxiosResponse<Blob>> =>
  api.post(`${URL_DEFAULT}/controle-download-acervo`, dados, {
    responseType: 'blob',
  });

export default {
  gerarRelatorioControleLivrosEmprestados,
  gerarRelatorioControleAcervo,
  gerarRelatorioControleAcervoPorAutor,
  gerarRelatorioControleEditora,
  gerarRelatorioControleDevolucaoLivros,
  gerarRelatorioTitulosMaisPesquisados,
  gerarRelatorioDownloadAcervos,
};
