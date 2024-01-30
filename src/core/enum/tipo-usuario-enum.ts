export enum TipoUsuario {
  CORESSO = 0,
  SERVIDOR_PUBLICO = 1,
  ESTUDANTE = 2,
  PROFESSOR = 3,
  POPULACAO_GERAL = 4,
}

export const TipoUsuarioDisplay: Record<TipoUsuario, string> = {
  [TipoUsuario.CORESSO]: 'Servidor SME',
  [TipoUsuario.SERVIDOR_PUBLICO]: 'Servidor público',
  [TipoUsuario.ESTUDANTE]: 'Estudante',
  [TipoUsuario.PROFESSOR]: 'Professor',
  [TipoUsuario.POPULACAO_GERAL]: 'População em geral',
};
