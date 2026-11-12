import jwt_decode from 'jwt-decode';

import {
  menuTemPermissao,
  obterPermissaoPorMenu,
  obterPermissaoPorRolesMenu,
  validarAutenticacao,
  verificaSeTemPermissao,
  verificaSomenteConsulta,
} from './';

import { menus } from '~/components/cdep/sider/menus';
import { MenuEnum } from '~/core/enum/menu-enum';
import { store } from '~/core/redux';
import { setPerfilSelecionado, setPerfilUsuario } from '~/core/redux/modules/perfil/actions';
import { setPermissaoPorMenu, setRoles } from '~/core/redux/modules/roles/actions';

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
        {
          key: 2, // MenuEnum.MeusDados
        },
        {
          key: 3, // Submenu sem roles
        },
      ],
    },
    {
      // Menu sem children
      key: 99,
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

  it('C11: verificaSomenteConsulta retorna false quando qualquer permissão de escrita está ativa ou podeConsultar é falso', () => {
    expect(
      verificaSomenteConsulta({
        podeConsultar: true,
        podeAlterar: true,
        podeIncluir: false,
        podeExcluir: false,
      }),
    ).toBe(false);

    expect(
      verificaSomenteConsulta({
        podeConsultar: true,
        podeAlterar: false,
        podeIncluir: true,
        podeExcluir: false,
      }),
    ).toBe(false);

    expect(
      verificaSomenteConsulta({
        podeConsultar: true,
        podeAlterar: false,
        podeIncluir: false,
        podeExcluir: true,
      }),
    ).toBe(false);

    expect(
      verificaSomenteConsulta({
        podeConsultar: false,
        podeAlterar: false,
        podeIncluir: false,
        podeExcluir: false,
      }),
    ).toBe(false);
  });

  it('C12: menuTemPermissao avalia corretamente todas as flags de permissão e retorna false quando nenhuma está ativa', () => {
    expect(menuTemPermissao({ podeAlterar: true })).toBe(true);
    expect(menuTemPermissao({ podeConsultar: true })).toBe(true);
    expect(menuTemPermissao({ podeExcluir: true })).toBe(true);
    expect(menuTemPermissao({ podeIncluir: true })).toBe(true);
    expect(
      menuTemPermissao({
        podeAlterar: false,
        podeConsultar: false,
        podeExcluir: false,
        podeIncluir: false,
      }),
    ).toBe(false);
  });

  it('C13: carregarMenusEPermissao configura MenuEnum.MeusDados com permissão total e respeita menus vazios', () => {
    (jwt_decode as jest.Mock).mockReturnValue({
      perfil: 'ADMIN',
      roles: ['CONSULTAR', 'INCLUIR'],
    });

    validarAutenticacao({
      token: 'token-completo',
      perfilUsuario: [{ perfil: 'ADMIN', perfilNome: 'Admin' }],
    } as any);

    expect(setPermissaoPorMenu).toHaveBeenCalledTimes(1);
    const permissoesGeradas = (setPermissaoPorMenu as jest.Mock).mock.calls[0][0];

    // MenuEnum.MeusDados (key = 2) recebe todas as permissões e exibir = true
    expect(permissoesGeradas[MenuEnum.MeusDados]).toEqual({
      key: MenuEnum.MeusDados,
      exibir: true,
      permissao: {
        podeConsultar: true,
        podeIncluir: true,
        podeExcluir: true,
        podeAlterar: true,
        somenteConsulta: false,
      },
    });

    // Submenu key = 1 avalia as roles passadas e calcula somenteConsulta = false (pois tem INCLUIR)
    expect(permissoesGeradas[1]).toEqual({
      key: 1,
      exibir: true,
      permissao: {
        podeConsultar: true,
        podeIncluir: true,
        podeExcluir: false,
        podeAlterar: false,
        customRoles: undefined,
        somenteConsulta: false,
      },
    });

    // Submenu key = 3 (sem roles) não é adicionado
    expect(permissoesGeradas[3]).toBeUndefined();

    // Quando a lista global de menus está vazia, não despacha setPermissaoPorMenu
    const backupMenus = [...menus];
    menus.splice(0, menus.length);
    (setPermissaoPorMenu as jest.Mock).mockClear();

    validarAutenticacao({
      token: 'token-sem-menus',
      perfilUsuario: [{ perfil: 'ADMIN', perfilNome: 'Admin' }],
    } as any);

    expect(setPermissaoPorMenu).not.toHaveBeenCalled();
    menus.push(...backupMenus);
  });

  it('C14: validarAutenticacao não despacha setPerfilSelecionado quando perfil não é encontrado e usa roles=[] quando token não traz roles', () => {
    (jwt_decode as jest.Mock).mockReturnValue({
      perfil: 'PERFIL_INEXISTENTE',
      roles: undefined,
    });

    const data = {
      token: 'token-sem-roles',
      perfilUsuario: [{ perfil: 'OUTRO_PERFIL', perfilNome: 'Outro' }],
    } as any;

    const resultado = validarAutenticacao(data);

    expect(resultado).toBeUndefined();
    expect(setPerfilUsuario).toHaveBeenCalledWith(data.perfilUsuario);
    expect(setPerfilSelecionado).not.toHaveBeenCalled();
    expect(setRoles).toHaveBeenCalledWith([]);
  });

  it('C15: obterPermissaoPorMenu retorna undefined para menu não cadastrado e verificaSeTemPermissao retorna false quando role não existe', () => {
    (store.getState as jest.Mock).mockReturnValue({
      roles: {
        roles: ['ROLE_LEITURA'],
        permissaoPorMenu: [],
      },
    });

    expect(obterPermissaoPorMenu(MenuEnum.Acervo)).toBeUndefined();
    expect(verificaSeTemPermissao('ROLE_ADMIN' as any)).toBe(false);
  });
});
