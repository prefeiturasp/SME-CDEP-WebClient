import { RetornoPerfilUsuarioDTO } from '~/core/dto/retorno-perfil-usuario-dto';
import { setDadosLogin, setDeslogar, typeSetDadosLogin, typeSetDeslogar } from './actions';

describe('Redux Auth Actions (src/core/redux/modules/auth/actions.tsx)', () => {
  it('C01: cria a action setDadosLogin com o tipo @auth/setDadosLogin e o payload completo', () => {
    const payload: RetornoPerfilUsuarioDTO = {
      usuarioNome: 'Maria Silva',
      usuarioLogin: '1234567',
      dataHoraExpiracao: '2026-12-31T23:59:59',
      token: 'jwt-token-valido',
      email: 'maria.silva@sme.prefeitura.sp.gov.br',
      autenticado: true,
      perfilUsuario: [
        {
          perfil: 'guid-perfil-admin',
          perfilNome: 'Administrador',
        },
      ],
    };

    const action = setDadosLogin(payload);

    expect(typeSetDadosLogin).toBe('@auth/setDadosLogin');
    expect(action).toEqual({
      type: '@auth/setDadosLogin',
      payload,
    });
    expect(action.payload).toBe(payload);
  });

  it('C02: cria a action setDeslogar com o tipo @auth/setDeslogar e sem payload', () => {
    const action = setDeslogar();

    expect(typeSetDeslogar).toBe('@auth/setDeslogar');
    expect(action).toEqual({
      type: '@auth/setDeslogar',
    });
    expect('payload' in action).toBe(false);
  });
});
