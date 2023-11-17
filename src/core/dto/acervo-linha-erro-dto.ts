import { AcervoLinhaRetornoDTO } from './acervo-linha-retorno-dto';
import { FormDefaultCadastroAcervoDTO } from './form-cadastro-acervo';

export type AcervoLinhaErroDTO = {
  numeroLinha: number;
  titulo: string;
  tombo: string;
  retornoObjeto: FormDefaultCadastroAcervoDTO;
  retornoErro: AcervoLinhaRetornoDTO;
};
