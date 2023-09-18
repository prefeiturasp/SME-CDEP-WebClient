import { URL_API_SUPORTE } from '../constants/urls-api';
import { IdNomeExcluidoDTO } from '../dto/id-nome-excluido-dto';
import { ApiResult, obterRegistro } from './api';

const obterListaSuporte = (): Promise<ApiResult<IdNomeExcluidoDTO[]>> =>
  obterRegistro(URL_API_SUPORTE);

export { obterListaSuporte };
