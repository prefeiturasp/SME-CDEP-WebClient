import { IdNomeDTO } from '../dto/id-nome-dto';
import { ApiResult, obterRegistro } from './api';

export const URL_API_ACERVO_FOTOGRAFICO = 'v1/AcervoFotografico';

const obterAcervoFotograficoPorId = (id: string | number): Promise<ApiResult<IdNomeDTO[]>> =>
  obterRegistro(`${URL_API_ACERVO_FOTOGRAFICO}/${id}`);

export { obterAcervoFotograficoPorId };
