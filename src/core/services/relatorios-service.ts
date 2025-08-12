import { AxiosResponse } from 'axios';
import api from './api';

const URL_DEFAULT = '/v1/relatorios';

export type RelatorioControleLivrosEmprestadosRequest = {
  solicitante?: string;
  tombo?: string;
  situacaoSolicitacaoItem?: number;
  situacaoEmprestimo?: number;
  modelo: number;
  somenteDevolvidos?: boolean;
};

const gerarRelatorioControleLivrosEmprestados = (
  dados: RelatorioControleLivrosEmprestadosRequest,
): Promise<AxiosResponse<Blob>> =>
  api.post(`${URL_DEFAULT}/controle-livros-emprestados`, dados, {
    responseType: 'blob',
  });

export default {
  gerarRelatorioControleLivrosEmprestados,
};
