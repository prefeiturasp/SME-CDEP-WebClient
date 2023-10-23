import { URL_API_SERIE_COLECAO } from '../constants/urls-api';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { ApiResult, obterRegistro } from './api';

//TODO: depois que o Vini terminar o endpoint, ajustar endpoint para "/resumido"
const obterSerieColecaoResumido = (): Promise<ApiResult<IdNomeDTO[]>> =>
  obterRegistro(URL_API_SERIE_COLECAO);

export { obterSerieColecaoResumido };
