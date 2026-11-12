import { fireEvent, render, screen } from '@testing-library/react';
import { CDEP_BUTTON_NOVA_SOLICITACAO } from '~/core/constants/ids/button/intex';
import { URL_API_ACERVO_SOLICITACAO } from '~/core/constants/urls-api';
import { ROUTES } from '~/core/enum/routes';
import Inicial from './index';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('~/components/lib/data-table', () => {
  return function MockDataTable({ columns, onRow, url, showOrderButton }: any) {
    const mockData = [
      {
        acervoSolicitacaoId: 101,
        tipoAcervo: 'Livro',
        titulo: 'História de SP',
        dataCriacao: '01/01/2026',
        dataVisita: '05/01/2026',
        situacao: 'Em análise',
      },
      {
        acervoSolicitacaoId: 102,
        tipoAcervo: 'Fotografia',
        titulo: 'Foto Antiga',
        dataCriacao: '',
        dataVisita: '',
        situacao: 'Concluído',
      },
    ];

    return (
      <div data-testid='data-table' data-url={url} data-show-order={String(showOrderButton)}>
        {mockData.map((row) => {
          const rowProps = onRow?.(row);
          return (
            <button
              type='button'
              key={row.acervoSolicitacaoId}
              data-testid={`row-${row.acervoSolicitacaoId}`}
              onClick={rowProps?.onClick}
            >
              {columns.map((col: any) => {
                const val = row[col.dataIndex as keyof typeof row];
                const rendered = col.render ? col.render(val, row) : val;
                return (
                  <span key={col.title}>
                    {col.title}: {rendered}
                  </span>
                );
              })}
            </button>
          );
        })}
      </div>
    );
  };
});

describe('Inicial', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o cabeçalho e botão de nova solicitação com ID correto', () => {
    render(<Inicial />);

    expect(screen.getByText('Minhas solicitações')).toBeInTheDocument();

    const botaoNovaSolicitacao = screen.getByRole('button', {
      name: /Nova Solicitação/i,
    });
    expect(botaoNovaSolicitacao).toBeInTheDocument();
    expect(botaoNovaSolicitacao).toHaveAttribute('id', CDEP_BUTTON_NOVA_SOLICITACAO);
  });

  it('deve navegar para a página de nova solicitação ao clicar no botão', () => {
    render(<Inicial />);

    const botaoNovaSolicitacao = screen.getByRole('button', {
      name: /Nova Solicitação/i,
    });
    fireEvent.click(botaoNovaSolicitacao);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SOLICITACAO);
  });

  it('deve passar a URL correta e configurar showOrderButton como false para a DataTable', () => {
    render(<Inicial />);

    const dataTable = screen.getByTestId('data-table');
    expect(dataTable).toHaveAttribute(
      'data-url',
      `${URL_API_ACERVO_SOLICITACAO}/minhas-solicitacoes`,
    );
    expect(dataTable).toHaveAttribute('data-show-order', 'false');
  });

  it('deve renderizar colunas e valores formatados na DataTable', () => {
    render(<Inicial />);

    expect(screen.getByText(/História de SP/i)).toBeInTheDocument();
    expect(screen.getByText(/01\/01\/2026/i)).toBeInTheDocument();
    expect(screen.getByText(/05\/01\/2026/i)).toBeInTheDocument();

    expect(screen.getByText(/Foto Antiga/i)).toBeInTheDocument();
  });

  it('deve navegar para a edição da solicitação ao clicar em uma linha', () => {
    render(<Inicial />);

    const linha101 = screen.getByTestId('row-101');
    fireEvent.click(linha101);

    expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.SOLICITACAO}/101`);
  });
});
