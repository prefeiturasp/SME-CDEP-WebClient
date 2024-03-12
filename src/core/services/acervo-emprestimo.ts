import { URL_API_ACERVO_EMPRESTIMO } from '../constants/urls-api';
import { AcervoEmprestimoProrrogacaoDTO } from '../dto/acervo-emprestimo-prorrogacao-dto';
import { SituacaoItemDTO } from '../dto/situacao-item-dto';
import { alterarRegistro, obterRegistro } from './api';

const obterSituacoesEmprestimo = () =>
  obterRegistro<SituacaoItemDTO[]>(`${URL_API_ACERVO_EMPRESTIMO}/situacoes`);

const prorrogarEmprestimo = (params: AcervoEmprestimoProrrogacaoDTO) =>
  alterarRegistro(`${URL_API_ACERVO_EMPRESTIMO}/prorrogar`, params);

const devolverEmprestimo = (acervoSolicitacaoItemId: number) =>
  alterarRegistro(`${URL_API_ACERVO_EMPRESTIMO}/${acervoSolicitacaoItemId}/devolver`);

export { devolverEmprestimo, obterSituacoesEmprestimo, prorrogarEmprestimo };
