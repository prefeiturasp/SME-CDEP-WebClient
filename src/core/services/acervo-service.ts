import { URL_API_ACERVO } from '../constants/urls-api';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { PesquisaAcervoDTO } from '../dto/pesquisa-acervo-dto';
import { ApiResult, obterRegistro } from './api';

const obterTiposAcervo = (): Promise<ApiResult<IdNomeDTO[]>> =>
  obterRegistro(`${URL_API_ACERVO}/tipos`);

const pesquisarAcervos = (
  numeroPagina: number,
  numeroRegistros: number,
  textoLivre?: string,
  tipoAcervo?: number | null,
  anoInicial?: number,
  anoFinal?: number,
): Promise<ApiResult<PesquisaAcervoDTO>> => {
  const url = `${URL_API_ACERVO}/pesquisar-acervos?numeroPagina=${numeroPagina}&numeroRegistros=${numeroRegistros}`;
  return obterRegistro(url, {
    params: { textoLivre, tipoAcervo, anoInicial, anoFinal },
  });
};

export { obterTiposAcervo, pesquisarAcervos };
