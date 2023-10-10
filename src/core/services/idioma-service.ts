import { URL_API_IDIOMA } from '../constants/urls-api';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { ApiResult, obterRegistro } from './api';

const obterIdioma = (): Promise<ApiResult<IdNomeDTO[]>> => obterRegistro(URL_API_IDIOMA);

export { obterIdioma };
