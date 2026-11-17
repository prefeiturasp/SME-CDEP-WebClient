import { RetornoPerfilUsuarioDTO } from '~/core/dto/retorno-perfil-usuario-dto';
import { MenuEnum } from '~/core/enum/menu-enum';
import { setPerfilSelecionado, setPerfilUsuario } from '../perfil/actions';
import rootReducer from '../reducers';
import { setPermissaoPorMenu, setRoles } from '../roles/actions';
import { setDadosLogin, setDeslogar, SetDadosLogin } from './actions';
import authReducer from './reducers';

describe('Redux Auth Reducer (src/core/redux/modules/auth/reducers.tsx)', () => {
  const initialState: RetornoPerfilUsuarioDTO = {
    usuarioNome: '',
    usuarioLogin: '',
    dataHoraExpiracao: '',
    token: '',
    email: '',
    autenticado: false,
    perfilUsuario: [],
  };

  const authenticatedPayload: RetornoPerfilUsuarioDTO = {
    usuarioNome: 'Carlos Oliveira',
    usuarioLogin: '7654321',
    dataHoraExpiracao: '2026-11-30T18:00:00',
    token: 'token-jwt-123',
    email: 'carlos.oliveira@sme.prefeitura.sp.gov.br',
    autenticado: true,
    perfilUsuario: [
      {
        perfil: 'perfil-dre',
        perfilNome: 'Gestor DRE',
      },
    ],
  };

  it('C03: retorna o estado inicial quando state é undefined e a action não é mapeada', () => {
    const unknownAction = { type: '@unknown/ACTION' } as unknown as SetDadosLogin;

    const state = authReducer(undefined, unknownAction);

    expect(state).toEqual(initialState);
  });

  it('C04: processa setDadosLogin atualizando todos os campos de autenticação de forma imutável', () => {
    const previousState: RetornoPerfilUsuarioDTO = { ...initialState };
    const snapshotBefore = { ...previousState, perfilUsuario: [...previousState.perfilUsuario] };

    const nextState = authReducer(previousState, setDadosLogin(authenticatedPayload));

    expect(nextState).toEqual(authenticatedPayload);
    expect(nextState).not.toBe(previousState);
    expect(previousState).toEqual(snapshotBefore);
  });

  it('C05a: sobrescreve os dados de sessão ao receber um novo setDadosLogin sobre estado já autenticado', () => {
    const firstState = authReducer(undefined, setDadosLogin(authenticatedPayload));

    const updatedPayload: RetornoPerfilUsuarioDTO = {
      ...authenticatedPayload,
      usuarioNome: 'Carlos Oliveira Atualizado',
      token: 'novo-token-jwt-456',
      perfilUsuario: [
        {
          perfil: 'perfil-sme',
          perfilNome: 'Administrador SME',
        },
      ],
    };

    const secondState = authReducer(firstState, setDadosLogin(updatedPayload));

    expect(secondState).toEqual(updatedPayload);
    expect(secondState).not.toBe(firstState);
    expect(firstState.token).toBe('token-jwt-123');
  });

  it('C05b: preserva o estado atual no reducer auth isolado ao receber setDeslogar (branch default) e reseta o estado global via rootReducer', () => {
    const loggedInState = authReducer(undefined, setDadosLogin(authenticatedPayload));

    // No reducer isolado, typeSetDeslogar cai no default e mantém o draft atual
    const isolatedAfterLogout = authReducer(loggedInState, setDeslogar());
    expect(isolatedAfterLogout).toBe(loggedInState);
    expect(isolatedAfterLogout.autenticado).toBe(true);

    // No rootReducer, typeSetDeslogar redefine state = undefined e restaura os estados iniciais de auth, perfil e roles
    let globalState = rootReducer(undefined, setDadosLogin(authenticatedPayload));
    globalState = rootReducer(globalState, setRoles(['ROLE_ADMIN']));
    globalState = rootReducer(
      globalState,
      setPermissaoPorMenu([
        {
          key: MenuEnum.Credito,
          exibir: true,
          permissao: {
            podeConsultar: true,
            podeIncluir: true,
            podeAlterar: true,
            podeExcluir: true,
          },
        },
      ]),
    );
    globalState = rootReducer(globalState, setPerfilUsuario(authenticatedPayload.perfilUsuario));
    globalState = rootReducer(
      globalState,
      setPerfilSelecionado(authenticatedPayload.perfilUsuario[0]),
    );

    expect(globalState.auth.autenticado).toBe(true);
    expect(globalState.roles.roles).toEqual(['ROLE_ADMIN']);
    expect(globalState.perfil.perfilSelecionado).toEqual(authenticatedPayload.perfilUsuario[0]);

    const resetGlobalState = rootReducer(globalState, setDeslogar());

    expect(resetGlobalState.auth).toEqual(initialState);
    expect(resetGlobalState.roles).toEqual({ roles: [], permissaoPorMenu: [] });
    expect(resetGlobalState.perfil).toEqual({
      perfilUsuario: [],
      perfilSelecionado: undefined,
    });
  });
});
