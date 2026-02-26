import { AxiosResponse } from 'axios';
import api from './api';
import { AcervosCadastradosDTO } from '../dto/acervos-cadastrados-dto';

const URL_DEFAULT = 'v1/PainelGerencial';

const obterAcervosCadastrados = (): Promise<AxiosResponse<AcervosCadastradosDTO[]>> =>
  api.get(`${URL_DEFAULT}/acervos-cadastrados`);

const obterQuantidadePesquisasMensais = (): Promise<AxiosResponse<AcervosCadastradosDTO[]>> =>
  api.get(`${URL_DEFAULT}/quantidade-pesquisas-mensais`);

const obterQuantidadeSolicitacoesMensais = (
  ano?: number,
): Promise<AxiosResponse<AcervosCadastradosDTO[]>> => {
  const params = new URLSearchParams();
  if (ano) params.append('ano', String(ano));
  const query = params.toString();
  return api.get(`${URL_DEFAULT}/quantidade-solicitacoes-mensais${query ? `?${query}` : ''}`);
};

const obterSolicitacoesPorSituacao = (): Promise<AxiosResponse<AcervosCadastradosDTO[]>> =>
  api.get(`${URL_DEFAULT}/solicitacoes-por-situacao`);

const obterControleLivrosEmprestados = (): Promise<AxiosResponse<AcervosCadastradosDTO[]>> =>
  api.get(`${URL_DEFAULT}/controle-livros-emprestados`);

const obterSolicitacoesTipoAcervo = (
  ano?: number,
  mes?: string,
): Promise<AxiosResponse<AcervosCadastradosDTO[]>> => {
  const params = new URLSearchParams();
  if (ano) params.append('ano', String(ano));
  if (mes && mes !== 'todos') params.append('mes', mes);
  const query = params.toString();
  return api.get(`${URL_DEFAULT}/solicitacoes-tipo-acervo${query ? `?${query}` : ''}`);
};

export default {
  obterAcervosCadastrados,
  obterQuantidadePesquisasMensais,
  obterQuantidadeSolicitacoesMensais,
  obterSolicitacoesPorSituacao,
  obterControleLivrosEmprestados,
  obterSolicitacoesTipoAcervo
};
