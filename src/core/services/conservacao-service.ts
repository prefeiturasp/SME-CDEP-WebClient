import { IdNomeExcluidoDTO } from '../dto/id-nome-excluido-dto';
import { ApiResult, obterRegistro } from './api';

export const URL_API_CONSERVACAO = 'v1/Conservacao';

const obterConservacoes = (): Promise<ApiResult<IdNomeExcluidoDTO[]>> =>
  obterRegistro(URL_API_CONSERVACAO);

export { obterConservacoes };
