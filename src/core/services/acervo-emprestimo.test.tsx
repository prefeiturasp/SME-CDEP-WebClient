/**
 * @jest-environment jsdom
 */

jest.mock('./api', () => ({
  __esModule: true,
  obterRegistro: jest.fn(),
  alterarRegistro: jest.fn(),
}));

jest.mock('../constants/urls-api', () => ({
  URL_API_ACERVO_EMPRESTIMO: '/acervo-emprestimo',
}));

import { obterRegistro, alterarRegistro } from './api';
import {
  obterSituacoesEmprestimo,
  prorrogarEmprestimo,
  devolverEmprestimo,
} from './acervo-emprestimo';

describe('acervo-emprestimo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter situacoes de emprestimo', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await obterSituacoesEmprestimo();

    expect(obterRegistro).toHaveBeenCalledWith('/acervo-emprestimo/situacoes');
  });

  it('deve prorrogar emprestimo', async () => {
    (alterarRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    const params = { id: 1 };

    await prorrogarEmprestimo(params as any);

    expect(alterarRegistro).toHaveBeenCalledWith(
      '/acervo-emprestimo/prorrogar',
      params,
    );
  });

  it('deve devolver emprestimo', async () => {
    (alterarRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await devolverEmprestimo(5);

    expect(alterarRegistro).toHaveBeenCalledWith(
      '/acervo-emprestimo/5/devolver',
    );
  });
});