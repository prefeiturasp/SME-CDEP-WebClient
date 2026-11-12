/**
 * @jest-environment jsdom
 */

jest.mock('./api', () => ({
  __esModule: true,
  obterRegistro: jest.fn(),
}));

import { obterListaSuporte } from './suporte-service';
import { obterRegistro } from './api';

describe('suporte-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar obterRegistro com tipoSuporte informado', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({});

    await obterListaSuporte(1 as any);

    expect(obterRegistro).toHaveBeenCalledWith(
      expect.stringContaining('?tipoSuporte=1'),
    );
  });

  it('deve usar tipoSuporte padrão quando não informado', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({});

    await obterListaSuporte();

    expect(obterRegistro).toHaveBeenCalledWith(
      expect.stringContaining('?tipoSuporte='),
    );
  });
});