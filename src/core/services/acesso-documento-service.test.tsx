import { obterAcessoDocumento } from './acesso-documento-service';
import { obterRegistro } from './api';
import { URL_API_ACESSO_DOCUMENTO } from '../constants/urls-api';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

describe('obterAcessoDocumento', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama obterRegistro com URL correta', async () => {
    (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await obterAcessoDocumento();

    expect(obterRegistro).toHaveBeenCalledWith(URL_API_ACESSO_DOCUMENTO);
    expect(obterRegistro).toHaveBeenCalledTimes(1);
  });
});