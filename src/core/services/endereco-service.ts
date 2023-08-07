import api from './api';
import { AxiosResponse } from 'axios';
import { RetornoCEPDTO } from '../dto/retorno-cep-dto';

const URL_DEFAULT = 'v1/CEP';

const obterDadosCEP = (cep: string): Promise<AxiosResponse<RetornoCEPDTO>> =>
  api.get(`${URL_DEFAULT}/${cep}`);

export default {
  obterDadosCEP,
};
