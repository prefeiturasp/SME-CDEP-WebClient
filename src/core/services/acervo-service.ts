import { IdNomeDTO } from '../dto/id-nome-dto';
import { ApiResult, obterRegistro } from './api';

export const URL_API_ACERVO = 'v1/Acervo';

const obterTiposAcervo = (): Promise<ApiResult<IdNomeDTO[]>> =>
  obterRegistro(`${URL_API_ACERVO}/tipos`);

export { obterTiposAcervo };
