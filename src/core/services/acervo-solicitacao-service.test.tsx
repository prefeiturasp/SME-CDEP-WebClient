/**
 * @jest-environment jsdom
 */

jest.mock('query-string', () => ({
  __esModule: true,
  default: {
    stringify: jest.fn(() => 'mock'),
  },
}));

jest.mock('./api', () => ({
  __esModule: true,
  obterRegistro: jest.fn(),
  inserirRegistro: jest.fn(),
  alterarRegistro: jest.fn(),
}));

jest.mock('../constants/urls-api', () => ({
  URL_API_ACERVO_SOLICITACAO: '/acervo-solicitacao',
}));

import {
  obterRegistro,
  inserirRegistro,
  alterarRegistro,
} from './api';

import service from './acervo-solicitacao-service';

describe('acervo-solicitacao-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter itens por filtros', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.obterItensDoAcervoPorFiltros([1, 2]);

    expect(obterRegistro).toHaveBeenCalledWith('/acervo-solicitacao', {
      params: { acervosIds: [1, 2] },
      paramsSerializer: expect.any(Object),
    });
  });

  it('deve inserir', async () => {
    (inserirRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.inserir([{ id: 1 }] as any);

    expect(inserirRegistro).toHaveBeenCalledWith('/acervo-solicitacao', [{ id: 1 }]);
  });

  it('deve obter por id', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.obterPorId(10);

    expect(obterRegistro).toHaveBeenCalledWith('/acervo-solicitacao/10');
  });

  it('deve obter minha solicitacao por id', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.obterMinhaSolicitacaoPorId(10);

    expect(obterRegistro).toHaveBeenCalledWith(
      '/acervo-solicitacao/minha-solicitacao/10',
    );
  });

  it('deve obter situacoes atendimento', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.obterSituacoesAtendimento();

    expect(obterRegistro).toHaveBeenCalledWith(
      '/acervo-solicitacao/situacoes-item',
    );
  });

  it('deve obter tipo atendimento', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.obterTipoAtendimento();

    expect(obterRegistro).toHaveBeenCalledWith(
      '/acervo-solicitacao/tipo-atendimento',
    );
  });

  it('deve obter detalhes por id', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.obterDetalhesParaAtendimentoSolicitacoesPorId(5);

    expect(obterRegistro).toHaveBeenCalledWith(
      '/acervo-solicitacao/detalhes/5',
    );
  });

  it('deve alterar data visita', async () => {
    (alterarRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.alterarDataVisitaDoItemAtendimento({} as any);

    expect(alterarRegistro).toHaveBeenCalledWith(
      '/acervo-solicitacao/alterar-data-visita',
      {},
    );
  });

  it('deve cancelar atendimento', async () => {
    (alterarRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.cancelarAtendimento(1);

    expect(alterarRegistro).toHaveBeenCalledWith(
      '/acervo-solicitacao/1/cancelar-atendimento',
    );
  });

  it('deve cancelar item atendimento', async () => {
    (alterarRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.cancelarItemAtendimento(2);

    expect(alterarRegistro).toHaveBeenCalledWith(
      '/acervo-solicitacao/2/cancelar-item-atendimento',
    );
  });

  it('deve confirmar atendimento', async () => {
    (alterarRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.confirmarAtendimento({} as any);

    expect(alterarRegistro).toHaveBeenCalledWith(
      '/acervo-solicitacao/confirmar-atendimento',
      {},
    );
  });

  it('deve confirmar atendimento manual', async () => {
    (inserirRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.confirmarAtendimentoManual({} as any);

    expect(inserirRegistro).toHaveBeenCalledWith(
      '/acervo-solicitacao/inserir-manual',
      {},
    );
  });

  it('deve alterar atendimento manual', async () => {
    (alterarRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.alterarAtendimentoManual({} as any);

    expect(alterarRegistro).toHaveBeenCalledWith(
      '/acervo-solicitacao/alterar-manual',
      {},
    );
  });

  it('deve finalizar atendimento', async () => {
    (alterarRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.finalizarAtendimento(3);

    expect(alterarRegistro).toHaveBeenCalledWith(
      '/acervo-solicitacao/3/finalizar-atendimento',
    );
  });

  it('deve finalizar item atendimento', async () => {
    (alterarRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

    await service.finalizarItemAtendimento(4);

    expect(alterarRegistro).toHaveBeenCalledWith(
      '/acervo-solicitacao/4/finalizar-atendimento-item',
    );
  });
});