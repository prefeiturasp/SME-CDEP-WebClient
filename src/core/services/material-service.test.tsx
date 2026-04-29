import { obterMaterial } from './material-service';
import { obterRegistro } from './api';
import { TipoMaterial } from '../enum/tipo-material-enum';
import { URL_API_MATERIAL } from '../constants/urls-api';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

describe('obterMaterial', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama obterRegistro com tipoMaterial padrão', async () => {
    (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await obterMaterial();

    expect(obterRegistro).toHaveBeenCalledWith(
      `${URL_API_MATERIAL}?tipoMaterial=${TipoMaterial.NAO_DEFINIDO}`,
    );
    expect(obterRegistro).toHaveBeenCalledTimes(1);
  });

  it('chama obterRegistro com tipoMaterial informado', async () => {
    (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await obterMaterial(TipoMaterial.BIBLIOGRAFICO);

    expect(obterRegistro).toHaveBeenCalledWith(
      `${URL_API_MATERIAL}?tipoMaterial=${TipoMaterial.BIBLIOGRAFICO}`,
    );
    expect(obterRegistro).toHaveBeenCalledTimes(1);
  });
});
