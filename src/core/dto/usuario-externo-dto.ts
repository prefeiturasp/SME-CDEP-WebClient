import { TipoUsuario } from '../enum/tipo-usuario-enum';

export interface UsuarioExternoDTO {
  cpf: string;
  email: string;
  nome: string;
  telefone: string;
  endereco: string;
  complemento?: string;
  numero: string | number;
  cidade: string;
  estado: string;
  cep: string;
  senha: string;
  confirmarSenha: string;
  tipoUsuario: TipoUsuario;
  bairro: string;
}
