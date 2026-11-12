import { PermissaoPorMenuDTO } from '~/core/dto/permissao-por-menu-dto';
import { RolesDTO } from '~/core/dto/roles-menu-dto';
import { MenuEnum } from '~/core/enum/menu-enum';
import { setPermissaoPorMenu, setRoles, SetRoles } from './actions';
import rolesReducer from './reducers';

describe('Redux Roles Reducer (src/core/redux/modules/roles/reducers.tsx)', () => {
  const initialState: RolesDTO = {
    roles: [],
    permissaoPorMenu: [],
  };

  const samplePermissoes: PermissaoPorMenuDTO[] = [
    {
      key: MenuEnum.Credito,
      exibir: true,
      permissao: {
        podeConsultar: true,
        podeIncluir: true,
        podeAlterar: false,
        podeExcluir: false,
      },
    },
  ];

  it('C07: retorna o estado inicial quando state é undefined e preserva o estado em actions desconhecidas', () => {
    const unknownAction = { type: '@unknown/ACTION' } as unknown as SetRoles;

    const stateFromUndefined = rolesReducer(undefined, unknownAction);
    expect(stateFromUndefined).toEqual(initialState);

    const populatedState: RolesDTO = {
      roles: ['ROLE_EXISTENTE'],
      permissaoPorMenu: samplePermissoes,
    };
    const stateAfterUnknown = rolesReducer(populatedState, unknownAction);
    expect(stateAfterUnknown).toBe(populatedState);
  });

  it('C08: atualiza roles via setRoles clonando o array recebido e preservando permissaoPorMenu', () => {
    const previousState: RolesDTO = {
      roles: ['ROLE_ANTIGA'],
      permissaoPorMenu: samplePermissoes,
    };
    const newRolesPayload = ['ROLE_NOVA_1', 'ROLE_NOVA_2'];

    const nextState = rolesReducer(previousState, setRoles(newRolesPayload));

    expect(nextState.roles).toEqual(['ROLE_NOVA_1', 'ROLE_NOVA_2']);
    expect(nextState.roles).not.toBe(newRolesPayload);
    expect(nextState.permissaoPorMenu).toBe(samplePermissoes);
    expect(previousState.roles).toEqual(['ROLE_ANTIGA']);
  });

  it('C09: atualiza permissaoPorMenu via setPermissaoPorMenu (incluindo array esparso indexado por MenuEnum e limpeza) preservando roles', () => {
    const previousState: RolesDTO = {
      roles: ['ROLE_ADMIN'],
      permissaoPorMenu: [],
    };

    const sparsePermissions: PermissaoPorMenuDTO[] = [];
    sparsePermissions[MenuEnum.Credito] = {
      key: MenuEnum.Credito,
      exibir: true,
      permissao: {
        podeConsultar: true,
        podeIncluir: true,
        podeAlterar: true,
        podeExcluir: true,
      },
    };

    const stateWithPermissions = rolesReducer(
      previousState,
      setPermissaoPorMenu(sparsePermissions),
    );

    expect(stateWithPermissions.roles).toEqual(['ROLE_ADMIN']);
    expect(stateWithPermissions.permissaoPorMenu).toEqual([...sparsePermissions]);
    expect(stateWithPermissions.permissaoPorMenu).not.toBe(sparsePermissions);
    expect(stateWithPermissions.permissaoPorMenu[MenuEnum.Credito]).toEqual(
      sparsePermissions[MenuEnum.Credito],
    );
    expect(previousState.permissaoPorMenu).toEqual([]);

    const clearedState = rolesReducer(stateWithPermissions, setPermissaoPorMenu([]));
    expect(clearedState.permissaoPorMenu).toEqual([]);
    expect(clearedState.roles).toEqual(['ROLE_ADMIN']);
  });
});
