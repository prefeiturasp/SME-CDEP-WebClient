export const typeSetToken = '@auth/setToken';

export interface SetToken {
  type: typeof typeSetToken;
  payload: string;
}

export const setToken = (payload: string): SetToken => {
  return {
    type: typeSetToken,
    payload,
  };
};
