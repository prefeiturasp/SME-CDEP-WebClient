import { PerfilUsuarioDTO } from '~/core/dto/perfil-usuario-dto';
import {
  setPerfilSelecionado,
  setPerfilUsuario,
  typeSetPerfilSelecionado,
  typeSetPerfilUsuario,
} from './actions';

describe('Redux Perfil Actions (src/core/redux/modules/perfil/actions.tsx)', () => {
  const perfisMock: PerfilUsuarioDTO[] = [
    {
      perfil: 'guid-perfil-1',
      perfilNome: 'Professor',
    },
    {
      perfil: 'guid-perfil-2',
      perfilNome: 'Coordenador Pedagógico',
    },
  ];

  it('C10a: cria a action setPerfilUsuario com o tipo @perfil/setPerfilUsuario e a lista de perfis', () => {
    const action = setPerfilUsuario(perfisMock);

    expect(typeSetPerfilUsuario).toBe('@perfil/setPerfilUsuario');
    expect(action).toEqual({
      type: '@perfil/setPerfilUsuario',
      payload: perfisMock,
    });
    expect(action.payload).toBe(perfisMock);
  });

  it('C10b: cria a action setPerfilSelecionado com o tipo @perfil/setPerfilSelecionado e o perfil escolhido', () => {
    const perfilEscolhido = perfisMock[1];

    const action = setPerfilSelecionado(perfilEscolhido);

    expect(typeSetPerfilSelecionado).toBe('@perfil/setPerfilSelecionado');
    expect(action).toEqual({
      type: '@perfil/setPerfilSelecionado',
      payload: perfilEscolhido,
    });
    expect(action.payload).toBe(perfilEscolhido);
  });
});
