import { obterCreditoAutorResumido } from './credito-autor-service';
import { obterRegistro } from './api';
import { URL_API_CREDITO_AUTOR } from '../constants/urls-api';
import { TipoCreditoAutoria } from '../enum/tipo-credito-autoria';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

describe('obterCreditoAutorResumido', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama obterRegistro sem tipo', async () => {
    (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await obterCreditoAutorResumido();

    expect(obterRegistro).toHaveBeenCalledWith(
      `${URL_API_CREDITO_AUTOR}/resumido`,
    );

    expect(obterRegistro).toHaveBeenCalledTimes(1);
  });

  it('chama obterRegistro com tipo informado', async () => {
    (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    const tipo = TipoCreditoAutoria.Autoria;

    await obterCreditoAutorResumido(tipo);

    expect(obterRegistro).toHaveBeenCalledWith(
      `${URL_API_CREDITO_AUTOR}/resumido?tipo=${tipo}`,
    );

    expect(obterRegistro).toHaveBeenCalledTimes(1);
  });
});