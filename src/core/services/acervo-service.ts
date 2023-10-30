import { URL_API_ACERVO } from '../constants/urls-api';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { PesquisaAcervoDTO } from '../dto/pesquisa-acervo-dto';
import { ApiResult, obterRegistro } from './api';

const obterTiposAcervo = (): Promise<ApiResult<IdNomeDTO[]>> =>
  obterRegistro(`${URL_API_ACERVO}/tipos`);

const pesquisarAcervos = (
  textoLivre?: string,
  tipoAcervo?: number | null,
): Promise<ApiResult<PesquisaAcervoDTO>> => {
  if (!textoLivre && !tipoAcervo) {
    return obterRegistro(`${URL_API_ACERVO}/pesquisar-acervos`);
  }

  if (textoLivre && !tipoAcervo) {
    return obterRegistro(`${URL_API_ACERVO}/pesquisar-acervos?textoLivre=${textoLivre}`);
  }

  if (!textoLivre && tipoAcervo) {
    return obterRegistro(`${URL_API_ACERVO}/pesquisar-acervos?tipoAcervo=${tipoAcervo}`);
  }

  return obterRegistro(
    `${URL_API_ACERVO}/pesquisar-acervos?textoLivre=${textoLivre}&tipoAcervo=${tipoAcervo}`,
  );
};

export { obterTiposAcervo, pesquisarAcervos };
