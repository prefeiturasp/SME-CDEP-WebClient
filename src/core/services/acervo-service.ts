import { URL_API_ACERVO } from '../constants/urls-api';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { ApiResult, obterRegistro } from './api';

const obterTiposAcervo = (): Promise<ApiResult<IdNomeDTO[]>> =>
  obterRegistro(`${URL_API_ACERVO}/tipos`);

export { obterTiposAcervo };
