import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';

import dayjs from 'dayjs';

import { setDeslogar } from '~/core/redux/modules/auth/actions';

import { notification } from '~/components/lib/notification';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import { store } from '../../redux';
import autenticacaoService, { URL_AUTENTICACAO_REVALIDAR } from '../autenticacao-service';

const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_SME_CDEP_API,
};

const api = axios.create({
  ...config,
});

const SEGUNDOS_ANTES_EXPIRAR = 0;
let refreshTokenPromise: any = null;

const deslogarDoSistema = () => {
  store.dispatch(setDeslogar());
};

const getRefreshToken = (token: string) =>
  autenticacaoService.autenticarRevalidar(token).then((resp) => resp);

const revalidarAutenticacao = async (tokenAntigo: string) => {
  if (!refreshTokenPromise) {
    refreshTokenPromise = getRefreshToken(tokenAntigo)
      .then((resposta) => {
        refreshTokenPromise = null;
        return resposta?.data;
      })
      .catch((e) => {
        console.log('Erro ao revalidar token', e);
        alert('Erro ao revalidar token');
      });
  }

  return refreshTokenPromise.then((dadosRefresh: any) => {
    if (dadosRefresh?.token) {
      // TODO
      // store.dispatch(setDadosRevalidarLogin(dadosRefresh));
    } else {
      deslogarDoSistema();
    }

    return dadosRefresh;
  });
};

const configPadraoAutenticacao = async (
  requestConfig: InternalAxiosRequestConfig,
  token: string,
  dataHoraExpiracao: string,
) => {
  const now = dayjs();

  const diff = now.diff(dayjs(dataHoraExpiracao), 'seconds');

  if (requestConfig.headers) {
    if (token) requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  if (
    requestConfig?.url !== URL_AUTENTICACAO_REVALIDAR &&
    token &&
    dataHoraExpiracao &&
    diff >= SEGUNDOS_ANTES_EXPIRAR
  ) {
    const dadosRevalidacao = await revalidarAutenticacao(token);
    if (requestConfig.headers && dadosRevalidacao?.token) {
      requestConfig.headers.Authorization = `Bearer ${dadosRevalidacao.token}`;
    } else {
      return Promise.reject();
    }
  }

  return requestConfig;
};

const configRevalidarAutenticacao = async (
  requestConfig: InternalAxiosRequestConfig,
  token: string,
) => {
  if (requestConfig?.headers && token) {
    requestConfig.headers.set('Authorization', `Bearer ${token}`);
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
};

api.interceptors.request.use(
  async (requestConfig: InternalAxiosRequestConfig) => {
    const { token, dataHoraExpiracao } = store.getState().auth;

    if (requestConfig?.url !== URL_AUTENTICACAO_REVALIDAR) {
      return configPadraoAutenticacao(requestConfig, token, dataHoraExpiracao);
    }

    return configRevalidarAutenticacao(requestConfig, token);
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error?.response?.status === HttpStatusCode.Unauthorized) {
      deslogarDoSistema();
    }

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

// TODO - Criar uma método genérico e as interfaces!
const openNotificationError = (mensagens: string[]) => {
  if (mensagens?.length) {
    mensagens.forEach((description) => {
      notification.error({
        message: 'Erro',
        description,
      });
    });
  }
};

export type ApiResult<T> = {
  dados: T;
  sucesso: boolean;
  mensagens: string[];
};

const tratarThen = <T>(response: AxiosResponse<T>): ApiResult<T> => {
  return { sucesso: true, dados: response?.data, mensagens: [] };
};

const tratarCatch = (error: AxiosError<RetornoBaseDTO>): ApiResult<any> => {
  const mensagens = error?.response?.data?.mensagens?.length
    ? error?.response?.data?.mensagens
    : [];

  openNotificationError(mensagens);

  return { sucesso: false, mensagens, dados: null };
};

export const obterRegistro = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> => {
  store.dispatch(setSpinning(true));
  return api
    .get(url, config)
    .then(tratarThen<T>)
    .catch(tratarCatch)
    .finally(() => store.dispatch(setSpinning(false)));
};

export const alterarRegistro = async <T>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> => {
  return api
    .put(url, params, config)
    .then(tratarThen<T>)
    .catch(tratarCatch);
};

export const inserirRegistro = async <T>(
  url: string,
  params: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> => {
  store.dispatch(setSpinning(true));
  return api
    .post(url, params, config)
    .then(tratarThen<T>)
    .catch(tratarCatch)
    .finally(() => store.dispatch(setSpinning(false)));
};

export const deletarRegistro = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> => {
  store.dispatch(setSpinning(true));
  return api
    .delete(url, config)
    .then(tratarThen<T>)
    .catch(tratarCatch)
    .finally(() => store.dispatch(setSpinning(false)));
};

export const alterarRegistroParcial = async <T>(
  url: string,
  params?: any,
): Promise<ApiResult<T>> => {
  return api
    .patch(url, params, config)
    .then(tratarThen<T>)
    .catch(tratarCatch);
};

export default api;
