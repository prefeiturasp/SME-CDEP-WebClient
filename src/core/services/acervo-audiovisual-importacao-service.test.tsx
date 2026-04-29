jest.mock('./api', () => ({
  inserirRegistro: jest.fn(),
  obterRegistro: jest.fn(),
  alterarRegistroParcial: jest.fn(),
}));

import service from './acervo-audiovisual-importacao-service';
import { inserirRegistro, obterRegistro, alterarRegistroParcial } from './api';
import { URL_API_ACERVO_AUDIOVISUAL_IMPORTACAO_PLANILHA } from '../constants/urls-api';

describe('acervo audiovisual importacao service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('importarArquivo', async () => {
    (inserirRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    const file = new File(['conteudo'], 'teste.csv');

    await service.importarArquivo(file);

    expect(inserirRegistro).toHaveBeenCalledTimes(1);
    expect(inserirRegistro).toHaveBeenCalledWith(
      URL_API_ACERVO_AUDIOVISUAL_IMPORTACAO_PLANILHA,
      expect.any(FormData),
      expect.any(Object),
    );
  });

  test('obterImportacaoPendente', async () => {
    (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await service.obterImportacaoPendente();

    expect(obterRegistro).toHaveBeenCalledTimes(1);
    expect(obterRegistro).toHaveBeenCalledWith(
      URL_API_ACERVO_AUDIOVISUAL_IMPORTACAO_PLANILHA,
    );
  });

  test('removerLinhaDoArquivo', async () => {
    (alterarRegistroParcial as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await service.removerLinhaDoArquivo(1, 5);

    expect(alterarRegistroParcial).toHaveBeenCalledWith(
      `${URL_API_ACERVO_AUDIOVISUAL_IMPORTACAO_PLANILHA}/1`,
      { numeroLinha: 5 },
    );
  });

  test('atualizarLinhaParaSucesso', async () => {
    (alterarRegistroParcial as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await service.atualizarLinhaParaSucesso(2, 7);

    expect(alterarRegistroParcial).toHaveBeenCalledWith(
      `${URL_API_ACERVO_AUDIOVISUAL_IMPORTACAO_PLANILHA}/atualizar-linha/2/sucesso`,
      { numeroLinha: 7 },
    );
  });
});