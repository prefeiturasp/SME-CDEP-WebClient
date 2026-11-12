import { obterAssuntoResumido } from './assunto-service';
import { obterRegistro } from './api';
import { URL_API_ASSUNTO } from '../constants/urls-api';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

describe('obterAssuntoResumido', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama obterRegistro com URL correta', async () => {
    (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await obterAssuntoResumido();

    expect(obterRegistro).toHaveBeenCalledWith(`${URL_API_ASSUNTO}/resumido`);
    expect(obterRegistro).toHaveBeenCalledTimes(1);
  });
});
