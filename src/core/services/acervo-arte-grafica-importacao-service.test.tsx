import service from './acervo-arte-grafica-importacao-service';
import { inserirRegistro, obterRegistro, alterarRegistroParcial } from './api';
import { URL_API_ACERVO_ARTE_GRAFICA_IMPORTACAO_PLANILHA } from '../constants/urls-api';

jest.mock('./api', () => ({
  inserirRegistro: jest.fn(),
  obterRegistro: jest.fn(),
  alterarRegistroParcial: jest.fn(),
}));

describe('acervo arte grafica importacao service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('importarArquivo', async () => {
    (inserirRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    const file = new File(['conteudo'], 'teste.csv');

    await service.importarArquivo(file);

    expect(inserirRegistro).toHaveBeenCalledTimes(1);
    expect(inserirRegistro).toHaveBeenCalledWith(
      URL_API_ACERVO_ARTE_GRAFICA_IMPORTACAO_PLANILHA,
      expect.any(FormData),
      expect.any(Object),
    );
  });

  test('obterImportacaoPendente', async () => {
    (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await service.obterImportacaoPendente();

    expect(obterRegistro).toHaveBeenCalledTimes(1);
    expect(obterRegistro).toHaveBeenCalledWith(
      URL_API_ACERVO_ARTE_GRAFICA_IMPORTACAO_PLANILHA,
    );
  });

  test('removerLinhaDoArquivo', async () => {
    (alterarRegistroParcial as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await service.removerLinhaDoArquivo(10, 2);

    expect(alterarRegistroParcial).toHaveBeenCalledTimes(1);
    expect(alterarRegistroParcial).toHaveBeenCalledWith(
      `${URL_API_ACERVO_ARTE_GRAFICA_IMPORTACAO_PLANILHA}/10`,
      { numeroLinha: 2 },
    );
  });

  test('atualizarLinhaParaSucesso', async () => {
    (alterarRegistroParcial as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await service.atualizarLinhaParaSucesso(5, 3);

    expect(alterarRegistroParcial).toHaveBeenCalledTimes(1);
    expect(alterarRegistroParcial).toHaveBeenCalledWith(
      `${URL_API_ACERVO_ARTE_GRAFICA_IMPORTACAO_PLANILHA}/atualizar-linha/5/sucesso`,
      { numeroLinha: 3 },
    );
  });
});