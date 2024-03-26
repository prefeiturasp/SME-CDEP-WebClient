export enum TipoPerfil {
  EXTERNO = '3092428d-ca98-4788-9717-e706df1945a0',
  ADMIN_BIBLIOTECA = 'b82673b9-52b9-4e01-9157-e19339b7211a',
  ADMIN_GERAL = 'd3766fb4-d753-4398-bfb0-c357724bb0a2',
  BASICO = '064b3481-439b-4c67-8c88-5d1f1e9b91ce',
  ADMIN_MEMORIA = '35f9d620-49a8-446a-8a75-0a0d26ebd79d',
  ADMIN_MEMORIAL = '89c9d50d-b73b-4dde-b870-7685fcd88b0c',
}

export const TipoUsuarioDisplay: Record<TipoPerfil, string> = {
  [TipoPerfil.EXTERNO]: 'Externo',
  [TipoPerfil.ADMIN_BIBLIOTECA]: 'Admin Biblioteca',
  [TipoPerfil.ADMIN_GERAL]: 'Admin Geral',
  [TipoPerfil.BASICO]: 'Básico',
  [TipoPerfil.ADMIN_MEMORIA]: 'Admin Memória',
  [TipoPerfil.ADMIN_MEMORIAL]: 'Admin Memorial',
};
