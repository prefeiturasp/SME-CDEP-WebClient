import { AcervoSolicitacaoItemRetornoDTO } from './acervo-solicitacao-item-retorno-dto';
import { ArquivoCodigoNomeDTO } from './arquivo-codigo-nome-dto';

export type AcervoSolicitacaoItemRetornoCadastroDTO = {
  situacao?: string;
  arquivos?: ArquivoCodigoNomeDTO[];
} & AcervoSolicitacaoItemRetornoDTO;
