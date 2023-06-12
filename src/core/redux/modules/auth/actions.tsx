import { UsuarioAutenticacaoRetornoDto } from '~/core/dto/usuario-autenticacao-retorno-dto';

export const typeSetDeslogar = '@auth/setDeslogar';
export const typeSetDadosLogin = '@auth/setDadosLogin';

export interface SetDeslogar {
  type: typeof typeSetDeslogar;
}

export interface SetDadosLogin {
  type: typeof typeSetDadosLogin;
  payload: UsuarioAutenticacaoRetornoDto;
}

export const setDeslogar = (): SetDeslogar => {
  return {
    type: typeSetDeslogar,
  };
};

export const setDadosLogin = (payload: UsuarioAutenticacaoRetornoDto): SetDadosLogin => {
  return {
    type: typeSetDadosLogin,
    payload,
  };
};
