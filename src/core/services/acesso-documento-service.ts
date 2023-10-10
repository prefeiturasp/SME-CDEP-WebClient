import { URL_API_ACESSO_DOCUMENTO } from '../constants/urls-api';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { ApiResult, obterRegistro } from './api';

const obterAcessoDocumento = (): Promise<ApiResult<IdNomeDTO[]>> =>
  obterRegistro(URL_API_ACESSO_DOCUMENTO);

export { obterAcessoDocumento };
