import { TipoUsuario } from '../enum/tipo-usuario-enum';

export type DadosSolicitanteDTO = {
  id: number;
  nome: string;
  login: string;
  telefone: string;
  endereco: string;
  email: string;
  tipo: string;
  tipoId: TipoUsuario;
};
