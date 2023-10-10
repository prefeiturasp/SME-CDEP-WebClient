import { URL_API_ACESSO_DOCUMENTO, URL_API_IDIOMA, URL_API_MATERIAL } from '../constants/urls-api';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { ApiResult, obterRegistro } from './api';

const obterMaterial = (): Promise<ApiResult<IdNomeDTO[]>> => obterRegistro(`${URL_API_MATERIAL}`);

const obterIdioma = (): Promise<ApiResult<IdNomeDTO[]>> => obterRegistro(`${URL_API_IDIOMA}`);

const obterAcessoDocumento = (): Promise<ApiResult<IdNomeDTO[]>> =>
  obterRegistro(`${URL_API_ACESSO_DOCUMENTO}`);

export { obterAcessoDocumento, obterIdioma, obterMaterial };
