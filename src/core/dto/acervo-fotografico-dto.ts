import { TipoAcervo } from '../enum/tipo-acervo';
import { AcervoFotograficoCadastroDTO } from './acervo-fotografico-cadastro-dto';
import { ArquivoResumidoDTO } from './arquivo-resumido-dto';
import { AuditoriaDTO } from './auditoria-dto';

export type AcervoFotograficoDTO = {
  id: number;
  acervoId: number;
  tipoAcervoId: TipoAcervo;
  arquivos?: ArquivoResumidoDTO[];
  auditoria: AuditoriaDTO;
} & AcervoFotograficoCadastroDTO;
