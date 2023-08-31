import { IdNomeDTO } from '../dto/id-nome-dto';
import { ApiResult, obterRegistro } from './api';

export const URL_API_CREDITO_AUTOR = 'v1/CreditoAutor';

const obterCreditoAutor = (): Promise<ApiResult<IdNomeDTO[]>> =>
  obterRegistro(`${URL_API_CREDITO_AUTOR}/resumido`);

export { obterCreditoAutor };
