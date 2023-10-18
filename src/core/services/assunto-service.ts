import { URL_API_ASSUNTO } from '../constants/urls-api';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { ApiResult, obterRegistro } from './api';

const obterAssunto = (): Promise<ApiResult<IdNomeDTO[]>> => obterRegistro(URL_API_ASSUNTO);

export { obterAssunto };
