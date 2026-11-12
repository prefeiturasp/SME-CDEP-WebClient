import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import service from '~/core/services/indicadores-service';
import Indicadores from './index';

jest.mock('~/core/services/indicadores-service', () => ({
  __esModule: true,
  default: {
    obterAcervosCadastrados: jest.fn(),
    obterQuantidadePesquisasMensais: jest.fn(),
    obterQuantidadeSolicitacoesMensais: jest.fn(),
    obterSolicitacoesPorSituacao: jest.fn(),
    obterControleLivrosEmprestados: jest.fn(),
    obterSolicitacoesTipoAcervo: jest.fn(),
  },
}));

jest.mock('~/components/lib/area-chart', () => {
  return function MockGraficoAreaChart(props: any) {
    return (
      <div data-testid={`area-chart-${props.titulo}`}>
        <span>{props.titulo}</span>
        <span data-testid={`dados-count-${props.titulo}`}>{props.dados?.length ?? 0}</span>
      </div>
    );
  };
});

jest.mock('~/components/lib/bar-chart', () => {
  return function MockGraficoBarChart(props: any) {
    return (
      <div data-testid={`bar-chart-${props.titulo}`}>
        <span>{props.titulo}</span>
        <span data-testid={`dados-count-${props.titulo}`}>{props.dados?.length ?? 0}</span>
        {props.barras && (
          <span data-testid={`barras-${props.titulo}`}>
            {props.barras.map((b: any) => b.dataKey).join(',')}
          </span>
        )}
        {props.filtros?.map((f: any) => (
          <div key={f.label} data-testid={`filtro-${props.titulo}-${f.label}`}>
            <span>
              {f.label}: {String(f.value)}
            </span>
            <button
              data-testid={`btn-${props.titulo}-${f.label}`}
              onClick={() => {
                const proximaOpcao = f.options?.[1]?.value ?? f.options?.[0]?.value;
                f.onChange(proximaOpcao);
              }}
            >
              Alterar {f.label}
            </button>
          </div>
        ))}
      </div>
    );
  };
});

describe('Indicadores', () => {
  const dadosMockPadrao = {
    acervosCadastrados: [
      { id: 2, nome: 'Livros', valor: 150 },
      { id: 1, nome: 'Documentos', valor: 80 },
    ],
    pesquisasMensais: [{ id: 1, nome: 'Janeiro', valor: 45 }],
    solicitacoesMensais: [
      { id: 1, nome: 'Janeiro', valor: 30, totalAutomatica: 10, totalManual: undefined },
      { id: 2, nome: 'Fevereiro', valor: 50, totalAutomatica: undefined, totalManual: 25 },
    ],
    solicitacoesSituacao: [
      { id: 1, nome: 'Pendente', valor: 12 },
      { id: 2, nome: 'Atendida', valor: 40 },
    ],
    livrosEmprestados: [
      { id: 1, nome: 'Emprestado', valor: 5 },
      { id: 2, nome: 'Devolvido', valor: 18 },
    ],
    solicitacoesTipoAcervo: [
      { id: 1, nome: 'Mapas', valor: 8 },
      { id: 2, nome: 'Fotografias', valor: 22 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (service.obterAcervosCadastrados as jest.Mock).mockResolvedValue({
      data: dadosMockPadrao.acervosCadastrados,
    });
    (service.obterQuantidadePesquisasMensais as jest.Mock).mockResolvedValue({
      data: dadosMockPadrao.pesquisasMensais,
    });
    (service.obterQuantidadeSolicitacoesMensais as jest.Mock).mockResolvedValue({
      data: dadosMockPadrao.solicitacoesMensais,
    });
    (service.obterSolicitacoesPorSituacao as jest.Mock).mockResolvedValue({
      data: dadosMockPadrao.solicitacoesSituacao,
    });
    (service.obterControleLivrosEmprestados as jest.Mock).mockResolvedValue({
      data: dadosMockPadrao.livrosEmprestados,
    });
    (service.obterSolicitacoesTipoAcervo as jest.Mock).mockResolvedValue({
      data: dadosMockPadrao.solicitacoesTipoAcervo,
    });
  });

  it('deve carregar e renderizar todos os gráficos com dados processados', async () => {
    render(<Indicadores />);

    expect(screen.getByText('Painel de indicadores')).toBeInTheDocument();

    await waitFor(() => {
      expect(service.obterAcervosCadastrados).toHaveBeenCalled();
      expect(service.obterQuantidadePesquisasMensais).toHaveBeenCalled();
      expect(service.obterQuantidadeSolicitacoesMensais).toHaveBeenCalled();
      expect(service.obterSolicitacoesPorSituacao).toHaveBeenCalled();
      expect(service.obterControleLivrosEmprestados).toHaveBeenCalled();
      expect(service.obterSolicitacoesTipoAcervo).toHaveBeenCalled();
    });

    // Acervos cadastrados adiciona 2 registros extras (início e fim) aos 2 retornados = 4
    expect(screen.getByTestId('dados-count-Acervos cadastrados')).toHaveTextContent('4');
    // Pesquisas mensais completa todos os 12 meses
    expect(screen.getByTestId('dados-count-Quantidade de pesquisas mensais')).toHaveTextContent(
      '12',
    );
    // Solicitações mensais completa todos os 12 meses
    expect(
      screen.getByTestId('dados-count-Quantidade de solicitações e atendimentos por período'),
    ).toHaveTextContent('12');
    // Solicitações por situação possui 2 registros
    expect(screen.getByTestId('dados-count-Solicitações por situação')).toHaveTextContent('2');
    // Controle livros emprestados possui 2 registros
    expect(screen.getByTestId('dados-count-Controle de livros emprestados')).toHaveTextContent('2');
    // Solicitações tipo acervo possui 2 registros
    expect(screen.getByTestId('dados-count-Solicitações por tipo de acervo')).toHaveTextContent(
      '2',
    );
  });

  it('deve alterar o ano e o tipo de atendimento no gráfico de solicitações mensais', async () => {
    render(<Indicadores />);

    await waitFor(() => {
      expect(service.obterQuantidadeSolicitacoesMensais).toHaveBeenCalled();
    });

    // Alterar o ano
    const btnAno = screen.getByTestId(
      'btn-Quantidade de solicitações e atendimentos por período-Ano',
    );
    fireEvent.click(btnAno);

    await waitFor(() => {
      // Deve ter chamado novamente com o novo ano
      expect(service.obterQuantidadeSolicitacoesMensais).toHaveBeenCalledTimes(2);
    });

    // Alterar o tipo de atendimento para total_por_tipo
    const btnTipo = screen.getByTestId(
      'btn-Quantidade de solicitações e atendimentos por período-Tipo de totais',
    );
    fireEvent.click(btnTipo);

    // Barras devem estar visíveis agora
    expect(
      screen.getByTestId('barras-Quantidade de solicitações e atendimentos por período'),
    ).toHaveTextContent('totalAutomatica,totalManual');
  });

  it('deve alterar o ano e o mês no gráfico de solicitações por tipo de acervo', async () => {
    render(<Indicadores />);

    await waitFor(() => {
      expect(service.obterSolicitacoesTipoAcervo).toHaveBeenCalled();
    });

    // Alterar ano em solicitações tipo acervo
    const btnAnoTipoAcervo = screen.getByTestId('btn-Solicitações por tipo de acervo-Ano');
    fireEvent.click(btnAnoTipoAcervo);

    await waitFor(() => {
      expect(service.obterSolicitacoesTipoAcervo).toHaveBeenCalledTimes(2);
    });

    // Alterar mês em solicitações tipo acervo
    const btnMesTipoAcervo = screen.getByTestId('btn-Solicitações por tipo de acervo-Mês');
    fireEvent.click(btnMesTipoAcervo);

    await waitFor(() => {
      expect(service.obterSolicitacoesTipoAcervo).toHaveBeenCalledTimes(3);
    });
  });

  it('deve capturar erros nos blocos catch sem quebrar a renderização', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn());

    (service.obterAcervosCadastrados as jest.Mock).mockRejectedValueOnce(new Error('Erro acervos'));
    (service.obterQuantidadePesquisasMensais as jest.Mock).mockRejectedValueOnce(
      new Error('Erro pesquisas'),
    );
    (service.obterQuantidadeSolicitacoesMensais as jest.Mock).mockRejectedValueOnce(
      new Error('Erro solicitacoes'),
    );
    (service.obterSolicitacoesPorSituacao as jest.Mock).mockRejectedValueOnce(
      new Error('Erro situacao'),
    );
    (service.obterControleLivrosEmprestados as jest.Mock).mockRejectedValueOnce(
      new Error('Erro emprestados'),
    );
    (service.obterSolicitacoesTipoAcervo as jest.Mock).mockRejectedValueOnce(
      new Error('Erro tipo acervo'),
    );

    render(<Indicadores />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledTimes(6);
    });

    consoleSpy.mockRestore();
  });
});
