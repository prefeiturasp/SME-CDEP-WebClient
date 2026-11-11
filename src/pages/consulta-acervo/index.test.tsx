import { render, screen } from '~/tests/test-utils';
import { ConsultaAcervo } from './index';
import { ROUTES } from '~/core/enum/routes';
import { setAcervosSelecionados } from '~/core/redux/modules/solicitacao/actions';

const mockNavigate = jest.fn();
let mockPathname = ROUTES.CONSULTA_ACERVO;
const mockDispatch = jest.fn();
let mockDataSource: any[] = [];

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname }),
  Outlet: () => <div data-testid='mock-outlet'>Conteúdo do Outlet</div>,
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppDispatch: () => mockDispatch,
}));

jest.mock('~/components/lib/header', () => {
  const MockHeader = ({ logo }: any) => <header data-testid='mock-header'>{logo}</header>;
  return MockHeader;
});

jest.mock('./filtro-consulta-acervo', () => ({
  FiltroConsultaAcervo: () => <div data-testid='mock-filtro-consulta-acervo' />,
}));

jest.mock('./components/button-enviar-para-minha-selecao', () => ({
  ButtonEnviarParaMinhaSelecao: () => (
    <button data-testid='mock-btn-enviar-selecao'>Enviar para a minha seleção</button>
  ),
}));

jest.mock('./provider', () => {
  const actual = jest.requireActual('./provider');
  const MockProvider = ({ children }: any) => (
    <actual.ConsultaAcervoContext.Provider
      value={{
        dataSource: mockDataSource,
        loading: false,
        listParams: { current: 1, pageSize: 5 },
        carregarDados: jest.fn(),
        onClickBuscar: jest.fn(),
        limparDados: jest.fn(),
      }}
    >
      {children}
    </actual.ConsultaAcervoContext.Provider>
  );
  return {
    ...actual,
    __esModule: true,
    default: MockProvider,
  };
});

describe('ConsultaAcervo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = ROUTES.CONSULTA_ACERVO;
    mockDataSource = [];
  });

  describe('Renderização dos Componentes Estruturais', () => {
    test('renderiza o Header com logo, o Filtro, e o Outlet', () => {
      render(<ConsultaAcervo />);

      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByAltText('CDEP LOGO HORIZONTAL')).toBeInTheDocument();
      expect(screen.getByTestId('mock-filtro-consulta-acervo')).toBeInTheDocument();
      expect(screen.getByTestId('mock-outlet')).toBeInTheDocument();
    });

    test('limpa acervos selecionados via dispatch no useEffect inicial', () => {
      render(<ConsultaAcervo />);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(setAcervosSelecionados([]));
    });
  });

  describe('StickyButtonEnviar (Botão flutuante de envio)', () => {
    test('não renderiza o botão flutuante quando dataSource for vazio', () => {
      mockPathname = ROUTES.CONSULTA_ACERVO;
      mockDataSource = [];

      render(<ConsultaAcervo />);

      expect(screen.queryByTestId('mock-btn-enviar-selecao')).not.toBeInTheDocument();
    });

    test('não renderiza o botão flutuante quando a rota não for CONSULTA_ACERVO, mesmo com dados', () => {
      mockPathname = `${ROUTES.CONSULTA_ACERVO}/detalhes`;
      mockDataSource = [{ acervoId: 1, titulo: 'Livro Teste' }];

      render(<ConsultaAcervo />);

      expect(screen.queryByTestId('mock-btn-enviar-selecao')).not.toBeInTheDocument();
    });

    test('renderiza o botão flutuante quando a rota for CONSULTA_ACERVO e dataSource tiver itens', () => {
      mockPathname = ROUTES.CONSULTA_ACERVO;
      mockDataSource = [{ acervoId: 1, titulo: 'Livro Teste' }];

      render(<ConsultaAcervo />);

      expect(screen.getByTestId('mock-btn-enviar-selecao')).toBeInTheDocument();
    });
  });
});
