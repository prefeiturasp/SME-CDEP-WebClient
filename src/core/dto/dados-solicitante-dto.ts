import { TipoUsuario } from '../enum/tipo-usuario-enum';

export type DadosSolicitanteDTO = {
  nome: string;
  cpf: string;
  telefone: string;
  endereco: string;
  email: string;
  tipo: TipoUsuario;
  tipoId: TipoUsuario;
  id: number;
};
