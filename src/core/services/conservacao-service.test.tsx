import { obterConservacoes } from './conservacao-service';
import { obterRegistro } from './api';
import { URL_API_CONSERVACAO } from '../constants/urls-api';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

describe('obterConservacoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama obterRegistro com URL correta', async () => {
    (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await obterConservacoes();

    expect(obterRegistro).toHaveBeenCalledWith(URL_API_CONSERVACAO);
  });
});