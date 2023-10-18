import { URL_API_SERIE_COLECAO } from '../constants/urls-api';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { ApiResult, obterRegistro } from './api';

const obterSerieColecao = (): Promise<ApiResult<IdNomeDTO[]>> =>
  obterRegistro(URL_API_SERIE_COLECAO);

export { obterSerieColecao };
