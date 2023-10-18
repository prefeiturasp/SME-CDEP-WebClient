import { URL_API_EDITORA } from '../constants/urls-api';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { ApiResult, obterRegistro } from './api';

const obterEditora = (): Promise<ApiResult<IdNomeDTO[]>> => obterRegistro(URL_API_EDITORA);

export { obterEditora };
