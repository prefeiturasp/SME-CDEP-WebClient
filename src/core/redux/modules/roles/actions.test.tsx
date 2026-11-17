import { PermissaoPorMenuDTO } from '~/core/dto/permissao-por-menu-dto';
import { MenuEnum } from '~/core/enum/menu-enum';
import { setPermissaoPorMenu, setRoles, typeSetPermissaoPorMenu, typeSetRoles } from './actions';

describe('Redux Roles Actions (src/core/redux/modules/roles/actions.tsx)', () => {
  it('C06a: cria a action setRoles com o tipo @roles/setRoles e a lista de roles informada', () => {
    const payload = ['ROLE_CREDITO_CONSULTAR', 'ROLE_CREDITO_EDITAR'];

    const action = setRoles(payload);

    expect(typeSetRoles).toBe('@roles/setRoles');
    expect(action).toEqual({
      type: '@roles/setRoles',
      payload,
    });
    expect(action.payload).toBe(payload);
  });

  it('C06b: cria a action setPermissaoPorMenu com o tipo @roles/setPermissaoPorMenu e o payload de permissões', () => {
    const payload: PermissaoPorMenuDTO[] = [
      {
        key: MenuEnum.Credito,
        exibir: true,
        permissao: {
          podeConsultar: true,
          podeIncluir: false,
          podeAlterar: true,
          podeExcluir: false,
        },
      },
    ];

    const action = setPermissaoPorMenu(payload);

    expect(typeSetPermissaoPorMenu).toBe('@roles/setPermissaoPorMenu');
    expect(action).toEqual({
      type: '@roles/setPermissaoPorMenu',
      payload,
    });
    expect(action.payload).toBe(payload);
  });
});
