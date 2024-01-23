import queryString from 'query-string';
import { URL_API_ACERVO_SOLICITACAO } from '../constants/urls-api';
import { AcervoSolicitacaoItemRetornoDTO } from '../dto/acervo-solicitacao-item-retorno-dto';
import { obterRegistro } from './api';

const obterItensDoAcervoPorFiltros = (acervosIds: number[]) =>
  obterRegistro<AcervoSolicitacaoItemRetornoDTO[]>(`${URL_API_ACERVO_SOLICITACAO}`, {
    params: { acervosIds },
    paramsSerializer: {
      serialize: (params) => {
        return queryString.stringify(params, {
          skipEmptyString: true,
          skipNull: true,
        });
      },
    },
  });

export default { obterItensDoAcervoPorFiltros };
