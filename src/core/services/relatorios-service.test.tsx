/**
 * @jest-environment jsdom
 */

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

import service from './relatorios-service';
import api from './api';

describe('relatorio-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve gerar relatorio controle livros emprestados', async () => {
    const dados = { modelo: 1 };

    await service.gerarRelatorioControleLivrosEmprestados(dados as any);

    expect(api.post).toHaveBeenCalledWith(
      '/v1/relatorios/controle-livros-emprestados',
      dados,
      { responseType: 'blob' },
    );
  });

  it('deve gerar relatorio controle acervo', async () => {
    const dados = { situacaoAcervo: 'A', tipoAcervo: 'B' };

    await service.gerarRelatorioControleAcervo(dados as any);

    expect(api.post).toHaveBeenCalledWith(
      '/v1/relatorios/controle-acervo',
      dados,
      { responseType: 'blob' },
    );
  });

  it('deve gerar relatorio controle acervo por autor', async () => {
    const dados = { autores: 'X', tipoAcervo: 'Y' };

    await service.gerarRelatorioControleAcervoPorAutor(dados as any);

    expect(api.post).toHaveBeenCalledWith(
      '/v1/relatorios/controle-acervo-autor',
      dados,
      { responseType: 'blob' },
    );
  });

  it('deve gerar relatorio controle editora', async () => {
    const dados = { editoraId: '1' };

    await service.gerarRelatorioControleEditora(dados as any);

    expect(api.post).toHaveBeenCalledWith(
      '/v1/relatorios/controle-editora',
      dados,
      { responseType: 'blob' },
    );
  });

  it('deve gerar relatorio controle devolucao livros', async () => {
    const dados = { somenteEmAtraso: true };

    await service.gerarRelatorioControleDevolucaoLivros(dados as any);

    expect(api.post).toHaveBeenCalledWith(
      '/v1/relatorios/controle-devolucao-livros',
      dados,
      { responseType: 'blob' },
    );
  });

  it('deve gerar relatorio titulos mais pesquisados', async () => {
    const dados = { dataInicio: null, dataFim: null, tipoAcervos: [] };

    await service.gerarRelatorioTitulosMaisPesquisados(dados as any);

    expect(api.post).toHaveBeenCalledWith(
      '/v1/relatorios/titulos-mais-pesquisados',
      dados,
      { responseType: 'blob' },
    );
  });

  it('deve gerar relatorio download acervos', async () => {
    const dados = { TipoAcervo: 'A', Titulo: 'B' };

    await service.gerarRelatorioDownloadAcervos(dados as any);

    expect(api.post).toHaveBeenCalledWith(
      '/v1/relatorios/controle-download-acervo',
      dados,
      { responseType: 'blob' },
    );
  });

  it('deve gerar relatorio historico solicitacoes', async () => {
    const dados = { dataInicio: null, dataFim: null, solicitante: 'X' };

    await service.gerarRelatorioHistoricoSolicitacoes(dados as any);

    expect(api.post).toHaveBeenCalledWith(
      '/v1/relatorios/historico-solicitacoes-acervo',
      dados,
      { responseType: 'blob' },
    );
  });
});