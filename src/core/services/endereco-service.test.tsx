import service from './endereco-service';
import api from './api';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe('cep service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('obterDadosCEP', async () => {
    await service.obterDadosCEP('12345678');

    expect(api.get).toHaveBeenCalledWith('v1/CEP/12345678');
  });
});