import { URL_API_ACERVO_SOLICITACAO, URL_API_ACERVO_SOLICITACAO_DETALHES } from '../constants/urls-api';
import { alterarRegistro, obterRegistro } from './api';

import queryString from 'query-string';
import { AcervoSolicitacaoItemCadastroDTO } from '../dto/acervo-solicitacao-item-cadastro-dto';
import { AcervoSolicitacaoItemRetornoCadastroDTO } from '../dto/acervo-solicitacao-item-retorno-cadastro-dto';
import { AcervoSolicitacaoItemRetornoDTO } from '../dto/acervo-solicitacao-item-retorno-dto';
import { SituacaoItemDTO } from '~/core/dto/situacao-item-dto';
import { inserirRegistro } from './api';
import { DetalhesSolicitacaoDTO } from '../dto/acervo-detalhes-solicitacao-dto';

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

const obterSituacoesAtendimento = () =>
  obterRegistro<SituacaoItemDTO[]>(`${URL_API_ACERVO_SOLICITACAO}/situacoes`);

const obterDetalhesAcervoSolicitacao = (acervoSolicitacaoId?:string) =>
  obterRegistro<DetalhesSolicitacaoDTO>(`${URL_API_ACERVO_SOLICITACAO_DETALHES}/${acervoSolicitacaoId}`);

const alterarDataVisitaAcervo = (params?:any) =>
  alterarRegistro<any>(`${URL_API_ACERVO_SOLICITACAO}/alterar-data-visita`, params);

export default { obterItensDoAcervoPorFiltros, inserir, obterPorId, obterSituacoesAtendimento, obterDetalhesAcervoSolicitacao, alterarDataVisitaAcervo };
