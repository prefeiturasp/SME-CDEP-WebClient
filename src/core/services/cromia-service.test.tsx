import { obterListaCromia } from './cromia-service';
import { obterRegistro } from './api';
import { URL_API_CROMIA } from '../constants/urls-api';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

describe('obterListaCromia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama obterRegistro com URL correta', async () => {
    (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await obterListaCromia();

    expect(obterRegistro).toHaveBeenCalledWith(URL_API_CROMIA);
  });
});