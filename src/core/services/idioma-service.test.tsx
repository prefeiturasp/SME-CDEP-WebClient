import { obterIdioma } from './idioma-service';
import { obterRegistro } from './api';
import { URL_API_IDIOMA } from '../constants/urls-api';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

describe('obterIdioma', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama obterRegistro com a url correta', async () => {
    (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await obterIdioma();

    expect(obterRegistro).toHaveBeenCalledWith(URL_API_IDIOMA);
  });
});