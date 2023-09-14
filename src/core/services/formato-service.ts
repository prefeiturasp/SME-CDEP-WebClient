import { URL_API_FORMATO_IMAGEM } from '../constants/urls-api';
import { IdNomeExcluidoDTO } from '../dto/id-nome-excluido-dto';
import { ApiResult, obterRegistro } from './api';

const obterFormatosImagem = (): Promise<ApiResult<IdNomeExcluidoDTO[]>> =>
  obterRegistro(URL_API_FORMATO_IMAGEM);

export { obterFormatosImagem };
