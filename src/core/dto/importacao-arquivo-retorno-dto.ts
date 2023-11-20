import { TipoAcervo } from '../enum/tipo-acervo';
import { AcervoLinhaErroDTO } from './acervo-linha-erro-dto';
import { AcervoLinhaRetornoSucessoDTO } from './acervo-linha-sucesso-dto';

export type ImportacaoArquivoRetornoDTO = {
  id: number;
  nome: string;
  tipoAcervo: TipoAcervo;
  dataImportacao: string;
  erros: AcervoLinhaErroDTO[];
  sucesso: AcervoLinhaRetornoSucessoDTO[];
};
