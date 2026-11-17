import { PerfilUsuarioDTO } from '~/core/dto/perfil-usuario-dto';
import { setPerfilSelecionado, setPerfilUsuario, SetPerfilUsuario } from './actions';
import perfilReducer from './reducers';

describe('Redux Perfil Reducer (src/core/redux/modules/perfil/reducers.tsx)', () => {
  const perfilProfessor: PerfilUsuarioDTO = {
    perfil: 'guid-professor',
    perfilNome: 'Professor',
  };

  const perfilDiretor: PerfilUsuarioDTO = {
    perfil: 'guid-diretor',
    perfilNome: 'Diretor de Escola',
  };

  it('C11: retorna o estado inicial quando state é undefined e preserva o estado em actions desconhecidas', () => {
    const unknownAction = { type: '@unknown/ACTION' } as unknown as SetPerfilUsuario;

    const initialState = perfilReducer(undefined, unknownAction);
    expect(initialState).toEqual({
      perfilUsuario: [],
      perfilSelecionado: undefined,
    });

    const populatedState = {
      perfilUsuario: [perfilProfessor],
      perfilSelecionado: perfilProfessor,
    };
    const stateAfterUnknown = perfilReducer(populatedState, unknownAction);
    expect(stateAfterUnknown).toBe(populatedState);
  });

  it('C12a: atualiza perfilUsuario via setPerfilUsuario preservando perfilSelecionado existente', () => {
    const previousState = {
      perfilUsuario: [perfilProfessor],
      perfilSelecionado: perfilProfessor,
    };
    const novaListaPerfis = [perfilProfessor, perfilDiretor];

    const nextState = perfilReducer(previousState, setPerfilUsuario(novaListaPerfis));

    expect(nextState).toEqual({
      perfilUsuario: novaListaPerfis,
      perfilSelecionado: perfilProfessor,
    });
    expect(nextState).not.toBe(previousState);
    expect(previousState.perfilUsuario).toEqual([perfilProfessor]);
  });

  it('C12b: atualiza perfilSelecionado via setPerfilSelecionado e permite troca de perfil ativo preservando perfilUsuario', () => {
    const stateComLista = perfilReducer(
      undefined,
      setPerfilUsuario([perfilProfessor, perfilDiretor]),
    );

    const statePrimeiroPerfil = perfilReducer(stateComLista, setPerfilSelecionado(perfilProfessor));
    expect(statePrimeiroPerfil.perfilSelecionado).toEqual(perfilProfessor);
    expect(statePrimeiroPerfil.perfilUsuario).toEqual([perfilProfessor, perfilDiretor]);

    const stateSegundoPerfil = perfilReducer(
      statePrimeiroPerfil,
      setPerfilSelecionado(perfilDiretor),
    );
    expect(stateSegundoPerfil.perfilSelecionado).toEqual(perfilDiretor);
    expect(stateSegundoPerfil.perfilUsuario).toEqual([perfilProfessor, perfilDiretor]);
    expect(statePrimeiroPerfil.perfilSelecionado).toEqual(perfilProfessor);
  });
});
