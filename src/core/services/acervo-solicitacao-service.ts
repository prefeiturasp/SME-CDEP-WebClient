import { URL_API_ACERVO_SOLICITACAO } from '../constants/urls-api';
import { SituacaoItemDTO } from '../dto/situacao-dto';
import { obterRegistro } from './api';

const obterSituacoesAcervo = ()=> 
  obterRegistro<SituacaoItemDTO[]>(`${URL_API_ACERVO_SOLICITACAO}/situacoes`);

export {
  obterSituacoesAcervo,
};
