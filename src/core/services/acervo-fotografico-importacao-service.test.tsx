/**
 * @jest-environment jsdom
 */

jest.mock('./api', () => ({
  __esModule: true,
  inserirRegistro: jest.fn(),
  obterRegistro: jest.fn(),
  alterarRegistroParcial: jest.fn(),
}));

jest.mock('../constants/urls-api', () => ({
  URL_API_ACERVO_FOTOGRAFICO_IMPORTACAO_PLANILHA: '/importacao-planilha',
}));

import {
  inserirRegistro,
  obterRegistro,
  alterarRegistroParcial,
} from './api';

import service from './acervo-fotografico-importacao-service';

describe('acervo-fotografico-importacao-planilha-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve importar arquivo', async () => {
    (inserirRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    const file = new File(['conteudo'], 'teste.xlsx');

    await service.importarArquivo(file);

    expect(inserirRegistro).toHaveBeenCalledWith(
      '/importacao-planilha',
      expect.any(FormData),
      {
        headers: { 'content-type': 'multipart/form-data' },
      },
    );
  });

  it('deve obter importacao pendente', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.obterImportacaoPendente();

    expect(obterRegistro).toHaveBeenCalledWith('/importacao-planilha');
  });

  it('deve remover linha do arquivo', async () => {
    (alterarRegistroParcial as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.removerLinhaDoArquivo(1, 10);

    expect(alterarRegistroParcial).toHaveBeenCalledWith(
      '/importacao-planilha/1',
      { numeroLinha: 10 },
    );
  });

  it('deve atualizar linha para sucesso', async () => {
    (alterarRegistroParcial as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.atualizarLinhaParaSucesso(2, 20);

    expect(alterarRegistroParcial).toHaveBeenCalledWith(
      '/importacao-planilha/atualizar-linha/2/sucesso',
      { numeroLinha: 20 },
    );
  });
});