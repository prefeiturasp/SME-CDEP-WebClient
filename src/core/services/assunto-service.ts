import { URL_API_ASSUNTO } from '../constants/urls-api';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { ApiResult, obterRegistro } from './api';

const obterAssuntoResumido = (): Promise<ApiResult<IdNomeDTO[]>> =>
  obterRegistro(`${URL_API_ASSUNTO}/resumido`);

export { obterAssuntoResumido };
