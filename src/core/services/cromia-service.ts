import { IdNomeExcluidoDTO } from '../dto/id-nome-excluido-dto';
import { ApiResult, obterRegistro } from './api';

export const URL_API_CROMIA = 'v1/Cromia';

const obterListaCromia = (): Promise<ApiResult<IdNomeExcluidoDTO[]>> =>
  obterRegistro(URL_API_CROMIA);

export { obterListaCromia };
