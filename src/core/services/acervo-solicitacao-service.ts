import { URL_API_ACERVO_SOLICITACAO } from '../constants/urls-api';
import { alterarRegistro, obterRegistro } from './api';

import queryString from 'query-string';
import { SituacaoItemDTO } from '~/core/dto/situacao-item-dto';
import { AcervoSolicitacaoConfirmarDTO } from '../dto/acervo-solicitacao-confirmar-dto';
import { AcervoSolicitacaoDetalheDTO } from '../dto/acervo-solicitacao-detalhe-dto';
import { AcervoSolicitacaoItemCadastroDTO } from '../dto/acervo-solicitacao-item-cadastro-dto';
import { AcervoSolicitacaoItemRetornoDTO } from '../dto/acervo-solicitacao-item-retorno-dto';
import { AcervoSolicitacaoManualDTO } from '../dto/acervo-solicitacao-manual-dto';
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

const obterDetalhesParaAtendimentoSolicitacoesPorId = (acervoSolicitacaoId: number) =>
  obterRegistro<AcervoSolicitacaoDetalheDTO>(
    `${URL_API_ACERVO_SOLICITACAO}/detalhes/${acervoSolicitacaoId}`,
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

const confirmarAtendimentoManual = (params: AcervoSolicitacaoManualDTO) =>
  inserirRegistro<number>(`${URL_API_ACERVO_SOLICITACAO}/inserir-manual`, params);

const alterarAtendimentoManual = (params: AcervoSolicitacaoManualDTO) =>
  alterarRegistro<number>(`${URL_API_ACERVO_SOLICITACAO}/alterar-manual`, params);

const finalizarAtendimento = (acervoSolicitacaoId: number) =>
  alterarRegistro<boolean>(
    `${URL_API_ACERVO_SOLICITACAO}/${acervoSolicitacaoId}/finalizar-atendimento`,
  );

const finalizarItemAtendimento = (acervoSolicitacaoItemId: number) =>
  alterarRegistro<boolean>(
    `${URL_API_ACERVO_SOLICITACAO}/${acervoSolicitacaoItemId}/finalizar-atendimento-item`,
  );

export default {
  finalizarItemAtendimento,
  obterItensDoAcervoPorFiltros,
  inserir,
  obterPorId,
  alterarAtendimentoManual,
  obterDetalhesParaAtendimentoSolicitacoesPorId,
  confirmarAtendimentoManual,
  obterSituacoesAtendimento,
  alterarDataVisitaDoItemAtendimento,
  cancelarAtendimento,
  cancelarItemAtendimento,
  confirmarAtendimento,
  obterTipoAtendimento,
  finalizarAtendimento,
};
