import { URL_API_MATERIAL } from '../constants/urls-api';
import { IdNomeExcluidoDTO } from '../dto/id-nome-excluido-dto';
import { TipoMaterial } from '../enum/tipo-material-enum';
import { ApiResult, obterRegistro } from './api';

const obterMaterial = (
  tipoMaterial: TipoMaterial = TipoMaterial.NAO_DEFINIDO,
): Promise<ApiResult<IdNomeExcluidoDTO[]>> =>
  obterRegistro(`${URL_API_MATERIAL}?tipoMaterial=${tipoMaterial}`);

export { obterMaterial };
