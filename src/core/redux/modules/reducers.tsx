import { combineReducers } from 'redux';
import auth from './auth/reducers';
import perfil from './perfil/reducers';
import roles from './roles/reducers';
import spin from './spin/reducers';
import solicitacao from './solicitacao/reducers';

import { typeSetDeslogar } from './auth/actions';

const appReducer = combineReducers({
  auth,
  spin,
  perfil,
  roles,
  solicitacao,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === typeSetDeslogar) state = undefined;

  return appReducer(state, action);
};

export default rootReducer;
