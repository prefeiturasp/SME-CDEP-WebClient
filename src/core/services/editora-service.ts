import { URL_API_EDITORA } from '../constants/urls-api';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { ApiResult, obterRegistro } from './api';

const obterEditoraResumido = (): Promise<ApiResult<IdNomeDTO[]>> =>
  obterRegistro(`${URL_API_EDITORA}/resumido`);

export { obterEditoraResumido };
