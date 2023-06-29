import { TipoUsuario } from '../enum/tipo-usuario-enum';

export type DadosUsuarioDTO = {
  nome: string;
  cpf: string;
  login: string;
  email: string;
  telefone: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  tipo: TipoUsuario;
};
