import {
  URL_API_ACERVO_SOLICITACAO,
  URL_API_ACERVO_SOLICITACAO_DETALHES,
} from '../constants/urls-api';
import { alterarRegistro, obterRegistro } from './api';

import queryString from 'query-string';
import { SituacaoItemDTO } from '~/core/dto/situacao-item-dto';
import { AcervoSolicitacaoConfirmarDTO } from '../dto/acervo-solicitacao-confirmar-dto';
import { AcervoSolicitacaoDetalheDTO } from '../dto/acervo-solicitacao-detalhe-dto';
import { AcervoSolicitacaoItemCadastroDTO } from '../dto/acervo-solicitacao-item-cadastro-dto';
import { AcervoSolicitacaoItemRetornoDTO } from '../dto/acervo-solicitacao-item-retorno-dto';
import { AcervoSolicitacaoRetornoCadastroDTO } from '../dto/acervo-solicitacao-retorno-cadastro-dto';
import { AlterarDataVisitaAcervoSolicitacaoItemDTO } from '../dto/alterar-data-visita-acervo-solicitacao-item-dto';
import { TipoAtendimentoDTO } from '../dto/tipo-atendimento-dto';
import { inserirRegistro } from './api';

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
  obterRegistro<AcervoSolicitacaoRetornoCadastroDTO>(
    `${URL_API_ACERVO_SOLICITACAO}/${acervoSolicitacaoId}`,
  );

const obterSituacoesAtendimento = () =>
  obterRegistro<SituacaoItemDTO[]>(`${URL_API_ACERVO_SOLICITACAO}/situacoes-item`);

const obterTipoAtendimento = () =>
  obterRegistro<TipoAtendimentoDTO[]>(`${URL_API_ACERVO_SOLICITACAO}/tipo-atendimento`);

const obterDetalhesAcervoSolicitacao = (acervoSolicitacaoId: number) =>
  obterRegistro<AcervoSolicitacaoDetalheDTO>(
    `${URL_API_ACERVO_SOLICITACAO_DETALHES}/${acervoSolicitacaoId}`,
  );

const alterarDataVisitaDoItemAtendimento = (params: AlterarDataVisitaAcervoSolicitacaoItemDTO) =>
  alterarRegistro<boolean>(`${URL_API_ACERVO_SOLICITACAO}/alterar-data-visita`, params);

const cancelarAtendimento = (acervoSolicitacaoId: number) =>
  alterarRegistro<boolean>(
    `${URL_API_ACERVO_SOLICITACAO}/${acervoSolicitacaoId}/cancelar-atendimento`,
  );

const cancelarItemAtendimento = (acervoSolicitacaoItemId: number) =>
  alterarRegistro<boolean>(
    `${URL_API_ACERVO_SOLICITACAO}/${acervoSolicitacaoItemId}/cancelar-item-atendimento`,
  );

const confirmarAtendimento = (params: AcervoSolicitacaoConfirmarDTO) =>
  alterarRegistro<boolean>(`${URL_API_ACERVO_SOLICITACAO}/confirmar-atendimento`, params);

export default {
  obterItensDoAcervoPorFiltros,
  inserir,
  obterPorId,
  obterSituacoesAtendimento,
  obterDetalhesAcervoSolicitacao,
  alterarDataVisitaDoItemAtendimento,
  cancelarAtendimento,
  cancelarItemAtendimento,
  confirmarAtendimento,
  obterTipoAtendimento,
};
