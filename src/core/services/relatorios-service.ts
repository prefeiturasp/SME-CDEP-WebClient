import { AxiosResponse } from 'axios';
import api from './api';

const URL_DEFAULT = '/v1/relatorios';

export type RelatorioControleLivrosEmprestadosRequest = {
  solicitante?: string;
  tombo?: string;
  situacaoSolicitacaoItem?: number;
  situacaoEmprestimo?: string;
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

export default {
  gerarRelatorioControleLivrosEmprestados,
  gerarRelatorioControleAcervo,
  gerarRelatorioControleAcervoPorAutor,
  gerarRelatorioControleEditora,
};
