import { URL_API_ACERVO } from '../constants/urls-api';
import { CodigoTomboDTO } from '../dto/codigo-tombo-dto';
import { FiltroTextoLivreTipoAcervoDTO } from '../dto/filtro-texto-livre-tipo-acervo-dto';
import { ConsultaAcervoDetalhesDTO } from '../dto/form-cadastro-detalhes';
import { IdNomeDTO } from '../dto/id-nome-dto';
import { PaginacaoResultadoDTO } from '../dto/paginacao-resultado-dto';
import { PesquisaAcervoDTO } from '../dto/pesquisa-acervo-dto';
import { TipoAcervo } from '../enum/tipo-acervo';
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

const obterDetalhamentoPorTipoAcervoECodigoAreaPublica = (
  codigo: ConsultaAcervoDetalhesDTO['codigo'] | ConsultaAcervoDetalhesDTO['codigoNovo'],
  tipo: TipoAcervo,
) =>
  obterRegistro<ConsultaAcervoDetalhesDTO>(`${URL_API_ACERVO}/detalhar-acervo`, {
    params: { codigo, tipo },
  });

const obterTermoDeCompromisso = () => obterRegistro<string>(`${URL_API_ACERVO}/termo-compromisso`);

const obterCodigoTombo = (codigoTombo: string) =>
  obterRegistro<CodigoTomboDTO>(`${URL_API_ACERVO}/pesquisar`, {
    params: { codigoTombo },
  });

export {
  obterCodigoTombo,
  obterDetalhamentoPorTipoAcervoECodigoAreaPublica,
  obterTermoDeCompromisso,
  obterTiposAcervo,
  pesquisarAcervosAreaPublica,
};
