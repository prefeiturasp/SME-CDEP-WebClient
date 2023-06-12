import { produce } from 'immer';

import { SetDadosLogin, SetDeslogar, typeSetDadosLogin } from './actions';
import { UsuarioAutenticacaoRetornoDto } from '~/core/dto/usuario-autenticacao-retorno-dto';

const initialValues: UsuarioAutenticacaoRetornoDto = {
  dataHoraExpiracao: '',
  token: '',
  usuarioLogin: '',
  usuarioNome: '',
  email: '',
  perfil: '',
  perfilNome: '',
  autenticado: false,
};

const auth = (
  state: UsuarioAutenticacaoRetornoDto = initialValues,
  action: SetDadosLogin | SetDeslogar,
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetDadosLogin:
        return { ...draft, ...action.payload };
      default:
        return draft;
    }
  });
};

export default auth;
