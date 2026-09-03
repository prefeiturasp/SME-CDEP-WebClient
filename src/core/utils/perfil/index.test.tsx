import jwt_decode from 'jwt-decode';

import {
  verificaSomenteConsulta,
  menuTemPermissao,
  validarAutenticacao,
  obterPermissaoPorMenu,
  verificaSeTemPermissao,
  obterPermissaoPorRolesMenu,
} from './';

import { store } from '~/core/redux';

jest.mock('jwt-decode');

jest.mock('~/core/redux', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(),
  },
}));

jest.mock('~/core/redux/modules/auth/actions', () => ({
  setDadosLogin: jest.fn((p) => ({ type: 'SET_LOGIN', payload: p })),
}));

jest.mock('~/core/redux/modules/perfil/actions', () => ({
  setPerfilSelecionado: jest.fn((p) => ({ type: 'SET_PERFIL_SEL', payload: p })),
  setPerfilUsuario: jest.fn((p) => ({ type: 'SET_PERFIL_USER', payload: p })),
}));

jest.mock('~/core/redux/modules/roles/actions', () => ({
  setPermissaoPorMenu: jest.fn((p) => ({ type: 'SET_PERMISSAO_MENU', payload: p })),
  setRoles: jest.fn((p) => ({ type: 'SET_ROLES', payload: p })),
}));

jest.mock('~/components/cdep/sider/menus', () => ({
  menus: [
    {
      children: [
        {
          key: 1,
          roles: {
            podeConsultar: 'CONSULTAR',
            podeIncluir: 'INCLUIR',
            podeExcluir: 'EXCLUIR',
            podeAlterar: 'ALTERAR',
          },
        },
      ],
    },
  ],
}));

describe('auth utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('verificaSomenteConsulta true', () => {
    const result = verificaSomenteConsulta({
      podeConsultar: true,
      podeAlterar: false,
      podeIncluir: false,
      podeExcluir: false,
    } as any);

    expect(result).toBe(true);
  });

  it('menuTemPermissao true', () => {
    const result = menuTemPermissao({
      podeConsultar: true,
    } as any);

    expect(result).toBe(true);
  });

  it('validarAutenticacao', () => {
    (jwt_decode as jest.Mock).mockReturnValue({
      perfil: 'ADMIN',
      roles: ['CONSULTAR'],
    });

    const data = {
      token: 'token',
      perfilUsuario: [{ perfil: 'ADMIN' }],
    } as any;

    const result = validarAutenticacao(data);

    expect(store.dispatch).toHaveBeenCalled();
    expect(result).toEqual({ perfil: 'ADMIN' });
  });

  it('obterPermissaoPorMenu', () => {
    (store.getState as jest.Mock).mockReturnValue({
      roles: {
        permissaoPorMenu: {
          1: { permissao: { podeConsultar: true } },
        },
      },
    });

    const result = obterPermissaoPorMenu(1 as any);

    expect(result.podeConsultar).toBe(true);
  });

  it('verificaSeTemPermissao', () => {
    (store.getState as jest.Mock).mockReturnValue({
      roles: {
        roles: ['ADMIN'],
      },
    });

    const result = verificaSeTemPermissao('ADMIN' as any);

    expect(result).toBe(true);
  });

  it('obterPermissaoPorRolesMenu', () => {
    (store.getState as jest.Mock).mockReturnValue({
      roles: {
        roles: ['CONSULTAR'],
      },
    });

    const result = obterPermissaoPorRolesMenu({
      podeConsultar: 'CONSULTAR',
      podeIncluir: 'INCLUIR',
      podeExcluir: 'EXCLUIR',
      podeAlterar: 'ALTERAR',
    } as any);

    expect(result.podeConsultar).toBe(true);
    expect(result.podeIncluir).toBe(false);
  });
});