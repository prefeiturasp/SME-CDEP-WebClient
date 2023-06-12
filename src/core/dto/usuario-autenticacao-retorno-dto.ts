export interface UsuarioAutenticacaoRetornoDto {
  dataHoraExpiracao: string;
  token: string;
  usuarioLogin: string;
  usuarioNome: string;
  email: string;
  perfil: string;
  perfilNome: string;
  autenticado: boolean;
}
