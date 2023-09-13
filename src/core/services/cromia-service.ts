import { URL_API_CROMIA } from '../constants/urls-api';
import { IdNomeExcluidoDTO } from '../dto/id-nome-excluido-dto';
import { ApiResult, obterRegistro } from './api';

const obterListaCromia = (): Promise<ApiResult<IdNomeExcluidoDTO[]>> =>
  obterRegistro(URL_API_CROMIA);

export { obterListaCromia };
