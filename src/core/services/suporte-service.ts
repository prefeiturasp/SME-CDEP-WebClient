import { IdNomeExcluidoDTO } from '../dto/id-nome-excluido-dto';
import { ApiResult, obterRegistro } from './api';

export const URL_API_SUPORTE = 'v1/Suporte';

const obterListaSuporte = (): Promise<ApiResult<IdNomeExcluidoDTO[]>> =>
  obterRegistro(URL_API_SUPORTE);

export { obterListaSuporte };
