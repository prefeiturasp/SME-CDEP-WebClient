import { URL_API_EDITORA } from '../constants/urls-api';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { ApiResult, obterRegistro } from './api';

//TODO: depois que o Vini terminar o endpoint, ajustar endpoint para "/resumido"
const obterEditoraResumido = (): Promise<ApiResult<IdNomeDTO[]>> => obterRegistro(URL_API_EDITORA);

export { obterEditoraResumido };
