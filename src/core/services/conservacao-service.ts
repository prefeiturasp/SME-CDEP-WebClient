import { URL_API_CONSERVACAO } from '../constants/urls-api';
import { IdNomeExcluidoDTO } from '../dto/id-nome-excluido-dto';
import { ApiResult, obterRegistro } from './api';

const obterConservacoes = (): Promise<ApiResult<IdNomeExcluidoDTO[]>> =>
  obterRegistro(URL_API_CONSERVACAO);

export { obterConservacoes };
