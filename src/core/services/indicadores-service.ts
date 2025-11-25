import { AxiosResponse } from 'axios';
import api from './api';
import { AcervosCadastradosDTO } from '../dto/acervos-cadastrados-dto';

const URL_DEFAULT = 'v1/PainelGerencial';

const obterAcervosCadastrados = (): Promise<AxiosResponse<AcervosCadastradosDTO[]>> =>
  api.get(`${URL_DEFAULT}/acervos-cadastrados`);

const obterQuantidadePesquisasMensais = (): Promise<AxiosResponse<AcervosCadastradosDTO[]>> =>
  api.get(`${URL_DEFAULT}/quantidade-pesquisas-mensais`);

export default {
  obterAcervosCadastrados,
  obterQuantidadePesquisasMensais,
};
