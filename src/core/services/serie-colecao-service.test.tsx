/**
 * @jest-environment jsdom
 */

jest.mock('./api', () => ({
  __esModule: true,
  obterRegistro: jest.fn(),
}));

import { obterSerieColecaoResumido } from './serie-colecao-service';
import { obterRegistro } from './api';

describe('serie-colecao-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar obterRegistro com a url correta', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({});

    await obterSerieColecaoResumido();

    expect(obterRegistro).toHaveBeenCalledTimes(1);
    expect(obterRegistro).toHaveBeenCalledWith(
      expect.stringContaining('/resumido'),
    );
  });
});