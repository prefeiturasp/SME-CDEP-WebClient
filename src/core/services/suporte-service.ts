import { URL_API_SUPORTE } from '../constants/urls-api';
import { IdNomeExcluidoDTO } from '../dto/id-nome-excluido-dto';
import { TipoSuporte } from '../enum/tipo-suporte';
import { ApiResult, obterRegistro } from './api';

const obterListaSuporte = (
  tipoSuporte: TipoSuporte = TipoSuporte.NAO_DEFINIDO,
): Promise<ApiResult<IdNomeExcluidoDTO[]>> =>
  obterRegistro(`${URL_API_SUPORTE}?tipoSuporte=${tipoSuporte}`);

export { obterListaSuporte };
