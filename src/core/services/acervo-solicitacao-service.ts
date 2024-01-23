import queryString from 'query-string';
import { URL_API_ACERVO_SOLICITACAO } from '../constants/urls-api';
import { AcervoSolicitacaoItemCadastroDTO } from '../dto/acervo-solicitacao-item-cadastro-dto';
import { AcervoSolicitacaoItemRetornoDTO } from '../dto/acervo-solicitacao-item-retorno-dto';
import { inserirRegistro, obterRegistro } from './api';
import { AcervoSolicitacaoItemRetornoCadastroDTO } from '../dto/acervo-solicitacao-item-retorno-cadastro-dto';

const obterItensDoAcervoPorFiltros = (acervosIds: number[]) =>
  obterRegistro<AcervoSolicitacaoItemRetornoDTO[]>(URL_API_ACERVO_SOLICITACAO, {
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

const inserir = (params: AcervoSolicitacaoItemCadastroDTO[]) =>
  inserirRegistro<number>(URL_API_ACERVO_SOLICITACAO, params);

const obterPorId = (acervoSolicitacaoId: number | string) =>
  obterRegistro<AcervoSolicitacaoItemRetornoCadastroDTO[]>(
    `${URL_API_ACERVO_SOLICITACAO}/${acervoSolicitacaoId}`,
  );

export default { obterItensDoAcervoPorFiltros, inserir, obterPorId };
