import { IdNomeExcluidoDTO } from '../dto/id-nome-excluido-dto';
import { ApiResult, obterRegistro } from './api';

export const URL_API_FORMATO_IMAGEM = 'v1/Formato';

const obterFormatosImagem = (): Promise<ApiResult<IdNomeExcluidoDTO[]>> =>
  obterRegistro(URL_API_FORMATO_IMAGEM);

export { obterFormatosImagem };
