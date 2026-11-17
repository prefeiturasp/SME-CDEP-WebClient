import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import api, {
  alterarRegistro,
  alterarRegistroParcial,
  deletarRegistro,
  inserirRegistro,
  obterRegistro,
  tratarCatch,
  tratarThen,
} from './';

import { notification } from '~/components/lib/notification';
import { store } from '~/core/redux';
import { setDeslogar } from '~/core/redux/modules/auth/actions';
import autenticacaoService, { URL_AUTENTICACAO_REVALIDAR } from '../autenticacao-service';

jest.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  };

  return {
    create: jest.fn(() => mockAxiosInstance),
    isCancel: jest.fn(() => false),
    HttpStatusCode: {
      Unauthorized: 401,
    },
  };
});

jest.mock('~/components/lib/notification', () => ({
  notification: {
    error: jest.fn(),
  },
}));

jest.mock('~/core/redux', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
      auth: {
        token: 'token',
        dataHoraExpiracao: new Date().toISOString(),
      },
    })),
  },
}));

// Captura os handlers registrados nos interceptors na carga inicial do módulo
const [requestOnFulfilled, requestOnRejected] = (api.interceptors.request.use as jest.Mock).mock
  .calls[0];
const [responseOnFulfilled, responseOnRejected] = (api.interceptors.response.use as jest.Mock).mock
  .calls[0];

describe('api service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('tratarThen deve retornar sucesso', () => {
    const response = { data: { teste: 1 } } as any;
    const result = tratarThen(response);

    expect(result).toEqual({
      sucesso: true,
      dados: { teste: 1 },
      mensagens: [],
    });
  });

  it('tratarCatch deve retornar erro e chamar notification', () => {
    const error = {
      response: {
        data: {
          mensagens: ['erro 1', 'erro 2'],
        },
      },
    } as any;

    const result = tratarCatch(error);

    expect(notification.error).toHaveBeenCalledTimes(2);
    expect(result.sucesso).toBe(false);
    expect(result.mensagens).toEqual(['erro 1', 'erro 2']);
  });

  it('obterRegistro sucesso', async () => {
    const getMock = jest.spyOn(api, 'get').mockResolvedValueOnce({ data: [1] } as any);

    const result = await obterRegistro('/teste');

    expect(getMock).toHaveBeenCalledWith('/teste', undefined);
    expect(store.dispatch).toHaveBeenCalled();
    expect(result.sucesso).toBe(true);
    expect(result.dados).toEqual([1]);
  });

  it('obterRegistro erro', async () => {
    jest.spyOn(api, 'get').mockRejectedValueOnce({
      response: { data: { mensagens: ['erro'] } },
    } as any);

    const result = await obterRegistro('/teste');

    expect(result.sucesso).toBe(false);
    expect(notification.error).toHaveBeenCalled();
  });

  it('inserirRegistro sucesso', async () => {
    const postMock = jest.spyOn(api, 'post').mockResolvedValueOnce({ data: true } as any);

    const result = await inserirRegistro('/teste', { a: 1 });

    expect(postMock).toHaveBeenCalledWith('/teste', { a: 1 }, undefined);
    expect(result.sucesso).toBe(true);
  });

  it('alterarRegistro sucesso', async () => {
    const putMock = jest.spyOn(api, 'put').mockResolvedValueOnce({ data: true } as any);

    const result = await alterarRegistro('/teste', { a: 1 });

    expect(putMock).toHaveBeenCalledWith('/teste', { a: 1 }, undefined);
    expect(result.sucesso).toBe(true);
  });

  it('deletarRegistro sucesso', async () => {
    const deleteMock = jest.spyOn(api, 'delete').mockResolvedValueOnce({ data: true } as any);

    const result = await deletarRegistro('/teste');

    expect(deleteMock).toHaveBeenCalledWith('/teste', undefined);
    expect(result.sucesso).toBe(true);
  });

  it('C01: interceptor de request injeta Authorization Bearer quando há token não expirado e lida com ausência de token ou headers', async () => {
    const futureDate = new Date(Date.now() + 3600 * 1000).toISOString();
    (store.getState as jest.Mock).mockReturnValueOnce({
      auth: {
        token: 'jwt-valido-123',
        dataHoraExpiracao: futureDate,
      },
    });

    const configComHeaders = {
      url: '/v1/acervos',
      headers: {},
    } as unknown as InternalAxiosRequestConfig;

    const resultComToken = await requestOnFulfilled(configComHeaders);
    expect(resultComToken.headers.Authorization).toBe('Bearer jwt-valido-123');

    // Sem token na store e com headers presente
    (store.getState as jest.Mock).mockReturnValueOnce({
      auth: {
        token: '',
        dataHoraExpiracao: '',
      },
    });

    const configSemToken = {
      url: '/v1/acervos',
      headers: {},
    } as unknown as InternalAxiosRequestConfig;

    const resultSemToken = await requestOnFulfilled(configSemToken);
    expect(resultSemToken.headers.Authorization).toBeUndefined();

    // Sem objeto headers no requestConfig
    (store.getState as jest.Mock).mockReturnValueOnce({
      auth: {
        token: 'jwt-valido-123',
        dataHoraExpiracao: futureDate,
      },
    });

    const configSemHeaders = {
      url: '/v1/acervos',
    } as unknown as InternalAxiosRequestConfig;

    const resultSemHeaders = await requestOnFulfilled(configSemHeaders);
    expect(resultSemHeaders).toBe(configSemHeaders);
  });

  it('C02: interceptor de request usa configRevalidarAutenticacao para URL_AUTENTICACAO_REVALIDAR com e sem token/headers', async () => {
    (store.getState as jest.Mock).mockReturnValueOnce({
      auth: {
        token: 'token-para-revalidar',
        dataHoraExpiracao: new Date().toISOString(),
      },
    });

    const mockSetHeader = jest.fn();
    const configRevalidacao = {
      url: URL_AUTENTICACAO_REVALIDAR,
      headers: {
        set: mockSetHeader,
      },
    } as unknown as InternalAxiosRequestConfig;

    const result = await requestOnFulfilled(configRevalidacao);
    expect(mockSetHeader).toHaveBeenCalledWith('Authorization', 'Bearer token-para-revalidar');
    expect(result.headers.Authorization).toBe('Bearer token-para-revalidar');

    // Sem token na rota de revalidação
    (store.getState as jest.Mock).mockReturnValueOnce({
      auth: {
        token: '',
        dataHoraExpiracao: '',
      },
    });

    const configSemToken = {
      url: URL_AUTENTICACAO_REVALIDAR,
      headers: {
        set: mockSetHeader,
      },
    } as unknown as InternalAxiosRequestConfig;

    const resultSemToken = await requestOnFulfilled(configSemToken);
    expect(resultSemToken.headers.Authorization).toBeUndefined();
  });

  it('C03: interceptor de request revalida o token expirado e atualiza o header Authorization com o novo token', async () => {
    const expiredDate = new Date(Date.now() - 60 * 1000).toISOString();
    (store.getState as jest.Mock).mockReturnValueOnce({
      auth: {
        token: 'token-expirado',
        dataHoraExpiracao: expiredDate,
      },
    });

    const revalidarSpy = jest
      .spyOn(autenticacaoService, 'autenticarRevalidar')
      .mockResolvedValueOnce({
        data: { token: 'token-renovado-999' },
      } as AxiosResponse);

    const requestConfig = {
      url: '/v1/solicitacoes',
      headers: {},
    } as unknown as InternalAxiosRequestConfig;

    const result = await requestOnFulfilled(requestConfig);

    expect(revalidarSpy).toHaveBeenCalledWith('token-expirado');
    expect(result.headers.Authorization).toBe('Bearer token-renovado-999');
    expect(store.dispatch).not.toHaveBeenCalledWith(setDeslogar());
  });

  it('C04: reutiliza a mesma refreshTokenPromise quando duas requisições simultâneas encontram o token expirado', async () => {
    const expiredDate = new Date(Date.now() - 60 * 1000).toISOString();
    (store.getState as jest.Mock).mockReturnValue({
      auth: {
        token: 'token-expirado-concorrente',
        dataHoraExpiracao: expiredDate,
      },
    });

    let resolveRefresh!: (value: AxiosResponse) => void;
    const revalidarSpy = jest
      .spyOn(autenticacaoService, 'autenticarRevalidar')
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveRefresh = resolve;
          }),
      );

    const req1 = { url: '/v1/req1', headers: {} } as unknown as InternalAxiosRequestConfig;
    const req2 = { url: '/v1/req2', headers: {} } as unknown as InternalAxiosRequestConfig;

    const p1 = requestOnFulfilled(req1);
    const p2 = requestOnFulfilled(req2);

    expect(revalidarSpy).toHaveBeenCalledTimes(1);

    resolveRefresh({
      data: { token: 'token-compartilhado' },
    } as AxiosResponse);

    const [res1, res2] = await Promise.all([p1, p2]);
    expect(res1.headers.Authorization).toBe('Bearer token-compartilhado');
    expect(res2.headers.Authorization).toBe('Bearer token-compartilhado');
  });

  it('C05: desloga do sistema e rejeita a requisição quando a revalidação não retorna um novo token', async () => {
    const expiredDate = new Date(Date.now() - 60 * 1000).toISOString();
    (store.getState as jest.Mock).mockReturnValueOnce({
      auth: {
        token: 'token-expirado-invalido',
        dataHoraExpiracao: expiredDate,
      },
    });

    jest.spyOn(autenticacaoService, 'autenticarRevalidar').mockResolvedValueOnce({
      data: {},
    } as AxiosResponse);

    const requestConfig = {
      url: '/v1/solicitacoes',
      headers: {},
    } as unknown as InternalAxiosRequestConfig;

    await expect(requestOnFulfilled(requestConfig)).rejects.toBeUndefined();
    expect(store.dispatch).toHaveBeenCalledWith(setDeslogar());
  });

  it('C06: trata rejeição em autenticarRevalidar registrando log, exibindo alert, deslogando e rejeitando a requisição', async () => {
    const expiredDate = new Date(Date.now() - 60 * 1000).toISOString();
    (store.getState as jest.Mock).mockReturnValueOnce({
      auth: {
        token: 'token-erro-revalidacao',
        dataHoraExpiracao: expiredDate,
      },
    });

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn());
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(jest.fn());

    const erroRefresh = new Error('Falha de rede no refresh');
    jest.spyOn(autenticacaoService, 'autenticarRevalidar').mockRejectedValueOnce(erroRefresh);

    const requestConfig = {
      url: '/v1/solicitacoes',
      headers: {},
    } as unknown as InternalAxiosRequestConfig;

    await expect(requestOnFulfilled(requestConfig)).rejects.toBeUndefined();

    expect(consoleLogSpy).toHaveBeenCalledWith('Erro ao revalidar token', erroRefresh);
    expect(alertSpy).toHaveBeenCalledWith('Erro ao revalidar token');
    expect(store.dispatch).toHaveBeenCalledWith(setDeslogar());

    consoleLogSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('C07: rejeita o erro no handler de falha do interceptor de request', async () => {
    const reqError = new Error('Request setup error');
    await expect(requestOnRejected(reqError)).rejects.toBe(reqError);
  });

  it('C08: interceptor de response retorna response no sucesso, desloga em 401 e rejeita em cancelamento ou outros erros', async () => {
    const okResponse = { status: 200, data: { ok: true } } as AxiosResponse;
    expect(responseOnFulfilled(okResponse)).toBe(okResponse);

    // Erro 401 Unauthorized -> dispara setDeslogar
    const erro401 = {
      response: {
        status: 401,
      },
    } as AxiosError;

    await expect(responseOnRejected(erro401)).rejects.toBe(erro401);
    expect(store.dispatch).toHaveBeenCalledWith(setDeslogar());

    // Erro cancelado via axios.isCancel
    (store.dispatch as jest.Mock).mockClear();
    (axios.isCancel as unknown as jest.Mock).mockReturnValueOnce(true);
    const cancelError = { message: 'Request canceled' } as AxiosError;

    await expect(responseOnRejected(cancelError)).rejects.toBe(cancelError);
    expect(store.dispatch).not.toHaveBeenCalled();

    // Erro 500 comum
    const erro500 = {
      response: {
        status: 500,
      },
    } as AxiosError;

    await expect(responseOnRejected(erro500)).rejects.toBe(erro500);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('C09: tratarCatch retorna lista vazia de mensagens e não aciona notification.error quando não há mensagens no erro', () => {
    const resultSemResponse = tratarCatch({} as AxiosError<any>);

    expect(resultSemResponse).toEqual({
      sucesso: false,
      mensagens: [],
      dados: null,
    });
    expect(notification.error).not.toHaveBeenCalled();
  });

  it('C10: alterarRegistroParcial executa api.patch com sucesso e captura erros via tratarCatch', async () => {
    const patchMock = jest
      .spyOn(api, 'patch')
      .mockResolvedValueOnce({ data: { atualizado: true } } as any);

    const resSucesso = await alterarRegistroParcial('/v1/parcial', { ativo: false });

    expect(patchMock).toHaveBeenCalledWith('/v1/parcial', { ativo: false }, expect.any(Object));
    expect(resSucesso).toEqual({
      sucesso: true,
      dados: { atualizado: true },
      mensagens: [],
    });

    jest.spyOn(api, 'patch').mockRejectedValueOnce({
      response: {
        data: {
          mensagens: ['Falha parcial'],
        },
      },
    } as any);

    const resErro = await alterarRegistroParcial('/v1/parcial', { ativo: true });
    expect(resErro.sucesso).toBe(false);
    expect(resErro.mensagens).toEqual(['Falha parcial']);
    expect(notification.error).toHaveBeenCalledWith({
      message: 'Erro',
      description: 'Falha parcial',
    });
  });
});
