import service from './indicadores-service';
import api from './api';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe('painel gerencial service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('obterAcervosCadastrados', async () => {
    await service.obterAcervosCadastrados();

    expect(api.get).toHaveBeenCalledWith(
      'v1/PainelGerencial/acervos-cadastrados',
    );
  });

  it('obterQuantidadePesquisasMensais', async () => {
    await service.obterQuantidadePesquisasMensais();

    expect(api.get).toHaveBeenCalledWith(
      'v1/PainelGerencial/quantidade-pesquisas-mensais',
    );
  });

  it('obterQuantidadeSolicitacoesMensais sem ano', async () => {
    await service.obterQuantidadeSolicitacoesMensais();

    expect(api.get).toHaveBeenCalledWith(
      'v1/PainelGerencial/quantidade-solicitacoes-mensais',
    );
  });

  it('obterQuantidadeSolicitacoesMensais com ano', async () => {
    await service.obterQuantidadeSolicitacoesMensais(2024);

    expect(api.get).toHaveBeenCalledWith(
      'v1/PainelGerencial/quantidade-solicitacoes-mensais?ano=2024',
    );
  });

  it('obterSolicitacoesPorSituacao', async () => {
    await service.obterSolicitacoesPorSituacao();

    expect(api.get).toHaveBeenCalledWith(
      'v1/PainelGerencial/solicitacoes-por-situacao',
    );
  });

  it('obterControleLivrosEmprestados', async () => {
    await service.obterControleLivrosEmprestados();

    expect(api.get).toHaveBeenCalledWith(
      'v1/PainelGerencial/controle-livros-emprestados',
    );
  });

  it('obterSolicitacoesTipoAcervo sem params', async () => {
    await service.obterSolicitacoesTipoAcervo();

    expect(api.get).toHaveBeenCalledWith(
      'v1/PainelGerencial/solicitacoes-tipo-acervo',
    );
  });

  it('obterSolicitacoesTipoAcervo com ano e mes', async () => {
    await service.obterSolicitacoesTipoAcervo(2024, '01');

    expect(api.get).toHaveBeenCalledWith(
      'v1/PainelGerencial/solicitacoes-tipo-acervo?ano=2024&mes=01',
    );
  });

  it('obterSolicitacoesTipoAcervo com mes todos', async () => {
    await service.obterSolicitacoesTipoAcervo(2024, 'todos');

    expect(api.get).toHaveBeenCalledWith(
      'v1/PainelGerencial/solicitacoes-tipo-acervo?ano=2024',
    );
  });
});