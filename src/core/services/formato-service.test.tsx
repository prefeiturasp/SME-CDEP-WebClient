import { obterFormatosImagem } from './formato-service';
import { obterRegistro } from './api';
import { URL_API_FORMATO_IMAGEM } from '../constants/urls-api';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

describe('obterFormatosImagem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama obterRegistro com a url correta', async () => {
    (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await obterFormatosImagem();

    expect(obterRegistro).toHaveBeenCalledWith(URL_API_FORMATO_IMAGEM);
  });
});