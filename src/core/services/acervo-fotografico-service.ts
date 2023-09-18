import { URL_API_ACERVO_FOTOGRAFICO } from '../constants/urls-api';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { ApiResult, obterRegistro } from './api';

const obterAcervoFotograficoPorId = (id: string | number): Promise<ApiResult<IdNomeDTO[]>> =>
  obterRegistro(`${URL_API_ACERVO_FOTOGRAFICO}/${id}`);

export { obterAcervoFotograficoPorId };
