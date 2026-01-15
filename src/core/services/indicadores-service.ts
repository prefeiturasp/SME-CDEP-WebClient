import { AxiosResponse } from 'axios';
import api from './api';
import { AcervosCadastradosDTO } from '../dto/acervos-cadastrados-dto';

const URL_DEFAULT = 'v1/PainelGerencial';

const obterAcervosCadastrados = (): Promise<AxiosResponse<AcervosCadastradosDTO[]>> =>
  api.get(`${URL_DEFAULT}/acervos-cadastrados`);

const obterQuantidadePesquisasMensais = (): Promise<AxiosResponse<AcervosCadastradosDTO[]>> =>
  api.get(`${URL_DEFAULT}/quantidade-pesquisas-mensais`);

const obterQuantidadeSolicitacoesMensais = (): Promise<AxiosResponse<AcervosCadastradosDTO[]>> =>
  api.get(`${URL_DEFAULT}/quantidade-solicitacoes-mensais`);

const obterSolicitacoesPorSituacao = (): Promise<AxiosResponse<AcervosCadastradosDTO[]>> =>
  api.get(`${URL_DEFAULT}/solicitacoes-por-situacao`);

const obterControleLivrosEmprestados = (): Promise<AxiosResponse<AcervosCadastradosDTO[]>> =>
  api.get(`${URL_DEFAULT}/controle-livros-emprestados`);

const obterSolicitacoesTipoAcervo = (): Promise<AxiosResponse<AcervosCadastradosDTO[]>> =>
  api.get(`${URL_DEFAULT}/solicitacoes-tipo-acervo`);

export default {
  obterAcervosCadastrados,
  obterQuantidadePesquisasMensais,
  obterQuantidadeSolicitacoesMensais,
  obterSolicitacoesPorSituacao,
  obterControleLivrosEmprestados,
  obterSolicitacoesTipoAcervo
};
