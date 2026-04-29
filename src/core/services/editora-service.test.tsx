import { obterEditoraResumido } from './editora-service';
import { obterRegistro } from './api';
import { URL_API_EDITORA } from '../constants/urls-api';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

describe('obterEditoraResumido', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama obterRegistro com URL correta', async () => {
    (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await obterEditoraResumido();

    expect(obterRegistro).toHaveBeenCalledWith(
      `${URL_API_EDITORA}/resumido`,
    );
  });
});