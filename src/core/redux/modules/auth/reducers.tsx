import { produce } from 'immer';
import { SetToken, typeSetToken } from './actions';

export interface AuthProps {
  token: string;
}

const initialValues = {
  token: '',
};

const auth = (state: AuthProps = initialValues, action: SetToken) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetToken:
        draft.token = action.payload;
        break;
      default:
        break;
    }
  });
};

export default auth;
