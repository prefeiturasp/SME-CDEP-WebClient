import { URL_API_ACERVO_SOLICITACAO } from '../constants/urls-api';
import { AcervoSolicitacaoItemConsultaDTO } from '../dto/acervo-solicitacao-item-consulta-dto';
import { AcervoSolicitacaoItemRetornoDTO } from '../dto/acervo-solicitacao-item-retorno-dto';
import { inserirRegistro } from './api';

const obterItensDoAcervoPorFiltros = (params: AcervoSolicitacaoItemConsultaDTO[]) =>
  inserirRegistro<AcervoSolicitacaoItemRetornoDTO[]>(
    `${URL_API_ACERVO_SOLICITACAO}/obter-itens`,
    params,
  );

export default { obterItensDoAcervoPorFiltros };
