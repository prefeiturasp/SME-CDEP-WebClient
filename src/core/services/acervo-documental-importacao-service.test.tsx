/**
 * @jest-environment jsdom
 */

jest.mock('./api', () => ({
  __esModule: true,
  inserirRegistro: jest.fn(),
  obterRegistro: jest.fn(),
  alterarRegistroParcial: jest.fn(),
}));

import service from './acervo-documental-importacao-service';
import {
  inserirRegistro,
  obterRegistro,
  alterarRegistroParcial,
} from './api';

describe('acervo-documental-importacao-planilha-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve importar arquivo corretamente', async () => {
    const file = new File(['conteudo'], 'teste.csv', { type: 'text/csv' });

    (inserirRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.importarArquivo(file);

    expect(inserirRegistro).toHaveBeenCalledTimes(1);

    const [, formData, config] = (inserirRegistro as jest.Mock).mock.calls[0];

    expect(formData).toBeInstanceOf(FormData);
    expect(config.headers['content-type']).toBe('multipart/form-data');
  });

  it('deve obter importacao pendente', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({});

    await service.obterImportacaoPendente();

    expect(obterRegistro).toHaveBeenCalledTimes(1);
  });

  it('deve remover linha do arquivo', async () => {
    (alterarRegistroParcial as jest.Mock).mockResolvedValue({});

    await service.removerLinhaDoArquivo(1, 10);

    expect(alterarRegistroParcial).toHaveBeenCalledWith(
      expect.stringContaining('/1'),
      { numeroLinha: 10 },
    );
  });

  it('deve atualizar linha para sucesso', async () => {
    (alterarRegistroParcial as jest.Mock).mockResolvedValue({});

    await service.atualizarLinhaParaSucesso(1, 20);

    expect(alterarRegistroParcial).toHaveBeenCalledWith(
      expect.stringContaining('/atualizar-linha/1/sucesso'),
      { numeroLinha: 20 },
    );
  });
});