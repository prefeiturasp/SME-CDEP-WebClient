import { fireEvent, render, screen } from '@testing-library/react';
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';
import EnviarSolicitacoes from './index';

const mockNavigate = jest.fn();
let mockParams: { id?: string } | undefined = {};
let mockPerfilState: any = {
  perfilSelecionado: {
    perfil: TipoPerfil.EXTERNO,
  },
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (selector: any) =>
    selector({
      perfil: mockPerfilState,
    }),
}));

jest.mock(
  '~/components/cdep/button/voltar',
  () =>
    function MockButtonVoltar({ onClick, id }: any) {
      return (
        <button id={id} data-testid='mock-btn-voltar' onClick={onClick}>
          Voltar
        </button>
      );
    },
);

jest.mock(
  '~/components/lib/header-page',
  () =>
    function MockHeaderPage({ title, children }: any) {
      return (
        <div data-testid='mock-header-page'>
          <h1>{title}</h1>
          {children}
        </div>
      );
    },
);

jest.mock(
  '~/components/lib/card-content',
  () =>
    function MockCardContent({ children }: any) {
      return <div data-testid='mock-card-content'>{children}</div>;
    },
);

jest.mock(
  './components/btn-enviar-solicitacao',
  () =>
    function MockBtnEnviarSolicitacoes() {
      return <div data-testid='mock-btn-enviar-solicitacao'>BtnEnviarSolicitacoes</div>;
    },
);

jest.mock(
  './components/btn-cancelar-solicitacao',
  () =>
    function MockBtnCancelarSolicitacoes() {
      return <div data-testid='mock-btn-cancelar-solicitacao'>BtnCancelarSolicitacoes</div>;
    },
);

jest.mock(
  './components/card-dados-solicitante',
  () =>
    function MockCardDadosSolicitante() {
      return <div data-testid='mock-card-dados-solicitante'>CardDadosSolicitante</div>;
    },
);

jest.mock(
  './components/lista-acervos-solicitacao',
  () =>
    function MockListaAcervosSolicitacao() {
      return <div data-testid='mock-lista-acervos-solicitacao'>ListaAcervosSolicitacao</div>;
    },
);

describe('EnviarSolicitacoes (Página de Solicitação)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    mockPerfilState = {
      perfilSelecionado: {
        perfil: TipoPerfil.EXTERNO,
      },
    };
  });

  it('deve renderizar a página como "Nova Solicitação" quando não houver id nos parâmetros', () => {
    render(<EnviarSolicitacoes />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nova Solicitação');
    expect(screen.getByTestId('mock-btn-voltar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-btn-cancelar-solicitacao')).toBeInTheDocument();
    expect(screen.getByTestId('mock-btn-enviar-solicitacao')).toBeInTheDocument();
    expect(screen.getByTestId('mock-card-dados-solicitante')).toBeInTheDocument();
    expect(screen.getByTestId('mock-lista-acervos-solicitacao')).toBeInTheDocument();
  });

  it('deve renderizar a página com "Solicitação - Nº123" quando o id estiver presente nos parâmetros', () => {
    mockParams = { id: '123' };
    render(<EnviarSolicitacoes />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Solicitação - Nº123');
  });

  it('deve renderizar "Nova Solicitação" quando paramsRoute for undefined', () => {
    mockParams = undefined;
    render(<EnviarSolicitacoes />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nova Solicitação');
  });

  describe('Navegação do botão Voltar', () => {
    it('deve navegar para ROUTES.INDICADORES quando perfil for ADMIN_GERAL', () => {
      mockPerfilState = { perfilSelecionado: { perfil: TipoPerfil.ADMIN_GERAL } };
      render(<EnviarSolicitacoes />);

      fireEvent.click(screen.getByTestId('mock-btn-voltar'));

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
    });

    it('deve navegar para ROUTES.INDICADORES quando perfil for ADMIN_BIBLIOTECA', () => {
      mockPerfilState = { perfilSelecionado: { perfil: TipoPerfil.ADMIN_BIBLIOTECA } };
      render(<EnviarSolicitacoes />);

      fireEvent.click(screen.getByTestId('mock-btn-voltar'));

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
    });

    it('deve navegar para ROUTES.INDICADORES quando perfil for ADMIN_MEMORIA', () => {
      mockPerfilState = { perfilSelecionado: { perfil: TipoPerfil.ADMIN_MEMORIA } };
      render(<EnviarSolicitacoes />);

      fireEvent.click(screen.getByTestId('mock-btn-voltar'));

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
    });

    it('deve navegar para ROUTES.INDICADORES quando perfil for ADMIN_MEMORIAL', () => {
      mockPerfilState = { perfilSelecionado: { perfil: TipoPerfil.ADMIN_MEMORIAL } };
      render(<EnviarSolicitacoes />);

      fireEvent.click(screen.getByTestId('mock-btn-voltar'));

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
    });

    it('deve navegar para ROUTES.PRINCIPAL quando perfil não for admin (ex: EXTERNO)', () => {
      mockPerfilState = { perfilSelecionado: { perfil: TipoPerfil.EXTERNO } };
      render(<EnviarSolicitacoes />);

      fireEvent.click(screen.getByTestId('mock-btn-voltar'));

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
    });

    it('deve navegar para ROUTES.PRINCIPAL quando perfil não for admin (ex: BASICO)', () => {
      mockPerfilState = { perfilSelecionado: { perfil: TipoPerfil.BASICO } };
      render(<EnviarSolicitacoes />);

      fireEvent.click(screen.getByTestId('mock-btn-voltar'));

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
    });

    it('deve navegar para ROUTES.PRINCIPAL quando perfilSelecionado for nulo ou indefinido', () => {
      mockPerfilState = { perfilSelecionado: null };
      render(<EnviarSolicitacoes />);

      fireEvent.click(screen.getByTestId('mock-btn-voltar'));

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
    });

    it('deve navegar para ROUTES.PRINCIPAL quando perfil for nulo no Redux', () => {
      mockPerfilState = null;
      render(<EnviarSolicitacoes />);

      fireEvent.click(screen.getByTestId('mock-btn-voltar'));

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
    });

    it('deve passar o id correto para ButtonVoltar', () => {
      render(<EnviarSolicitacoes />);

      expect(screen.getByTestId('mock-btn-voltar')).toHaveAttribute('id', CDEP_BUTTON_VOLTAR);
    });
  });
});
