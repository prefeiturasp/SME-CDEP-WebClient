import service from './acervo-tridimensional-importacao-service';
import { inserirRegistro, obterRegistro, alterarRegistroParcial } from './api';
import { URL_API_ACERVO_TRIDIMENSIONAL_IMPORTACAO_PLANILHA } from '../constants/urls-api';

jest.mock('./api', () => ({
  inserirRegistro: jest.fn(),
  obterRegistro: jest.fn(),
  alterarRegistroParcial: jest.fn(),
}));

describe('acervo tridimensional importacao service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('importarArquivo chama inserirRegistro corretamente', async () => {
    (inserirRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    const file = new File(['conteudo'], 'teste.csv');

    await service.importarArquivo(file);

    expect(inserirRegistro).toHaveBeenCalledTimes(1);
    expect(inserirRegistro).toHaveBeenCalledWith(
      URL_API_ACERVO_TRIDIMENSIONAL_IMPORTACAO_PLANILHA,
      expect.any(FormData),
      { headers: { 'content-type': 'multipart/form-data' } },
    );
  });

  it('obterImportacaoPendente chama obterRegistro corretamente', async () => {
    (obterRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await service.obterImportacaoPendente();

    expect(obterRegistro).toHaveBeenCalledTimes(1);
    expect(obterRegistro).toHaveBeenCalledWith(
      URL_API_ACERVO_TRIDIMENSIONAL_IMPORTACAO_PLANILHA,
    );
  });

  it('removerLinhaDoArquivo chama alterarRegistroParcial corretamente', async () => {
    (alterarRegistroParcial as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await service.removerLinhaDoArquivo(10, 2);

    expect(alterarRegistroParcial).toHaveBeenCalledTimes(1);
    expect(alterarRegistroParcial).toHaveBeenCalledWith(
      `${URL_API_ACERVO_TRIDIMENSIONAL_IMPORTACAO_PLANILHA}/10`,
      { numeroLinha: 2 },
    );
  });

  it('atualizarLinhaParaSucesso chama alterarRegistroParcial corretamente', async () => {
    (alterarRegistroParcial as jest.Mock).mockResolvedValueOnce({ sucesso: true });

    await service.atualizarLinhaParaSucesso(5, 3);

    expect(alterarRegistroParcial).toHaveBeenCalledTimes(1);
    expect(alterarRegistroParcial).toHaveBeenCalledWith(
      `${URL_API_ACERVO_TRIDIMENSIONAL_IMPORTACAO_PLANILHA}/atualizar-linha/5/sucesso`,
      { numeroLinha: 3 },
    );
  });
});