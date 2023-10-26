import { URL_API_CREDITO_AUTOR } from '../constants/urls-api';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { TipoCreditoAutoria } from '../enum/tipo-credito-autoria';
import { ApiResult, obterRegistro } from './api';

const obterCreditoAutorResumido = (tipo?: TipoCreditoAutoria): Promise<ApiResult<IdNomeDTO[]>> => {
  let url = `${URL_API_CREDITO_AUTOR}/resumido`;
  if (tipo) url = `${url}?tipo=${tipo}`;
  return obterRegistro(url);
};

export { obterCreditoAutorResumido };
