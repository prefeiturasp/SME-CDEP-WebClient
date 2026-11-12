import api, {
  tratarThen,
  tratarCatch,
  obterRegistro,
  inserirRegistro,
  alterarRegistro,
  deletarRegistro,
} from './';

import { notification } from '~/components/lib/notification';
import { store } from '~/core/redux';

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
});