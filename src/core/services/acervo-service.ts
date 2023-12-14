import { URL_API_ACERVO } from '../constants/urls-api';
import { FiltroTextoLivreTipoAcervoDTO } from '../dto/filtro-texto-livre-tipo-acervo-dto';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { PaginacaoResultadoDTO } from '../dto/paginacao-resultado-dto';
import { PesquisaAcervoDTO } from '../dto/pesquisa-acervo-dto';
import { ApiResult, obterRegistro } from './api';

const obterTiposAcervo = (): Promise<ApiResult<IdNomeDTO[]>> =>
  obterRegistro(`${URL_API_ACERVO}/tipos`);

const pesquisarAcervosAreaPublica = (
  numeroPagina: number,
  numeroRegistros: number,
  params: FiltroTextoLivreTipoAcervoDTO,
) => {
  const url = `${URL_API_ACERVO}/pesquisar-acervos`;
  return obterRegistro<PaginacaoResultadoDTO<PesquisaAcervoDTO[]>>(url, {
    params: { numeroPagina, numeroRegistros, ...params },
  });
};

export { obterTiposAcervo, pesquisarAcervosAreaPublica };
