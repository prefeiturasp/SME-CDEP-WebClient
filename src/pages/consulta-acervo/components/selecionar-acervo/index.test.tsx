import { render, screen, fireEvent } from '~/tests/test-utils';
import CheckboxSelecionarAcervo from './index';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { setAcervosSelecionados } from '~/core/redux/modules/solicitacao/actions';

const mockDispatch = jest.fn();
let mockAcervosSelecionados: number[] = [];

jest.mock('~/core/hooks/use-redux', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) =>
    selector({
      solicitacao: {
        acervosSelecionados: mockAcervosSelecionados,
      },
    }),
}));

describe('CheckboxSelecionarAcervo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAcervosSelecionados = [];
  });

  const mockAcervoBase: PesquisaAcervoDTO = {
    acervoId: 42,
    titulo: 'Dom Casmurro',
    estaDisponivel: true,
    temControleDisponibilidade: false,
  } as PesquisaAcervoDTO;

  describe('Renderização e Estado Inicial', () => {
    test('renderiza com texto "Selecionar" e desmarcado quando o acervo não está na lista', () => {
      mockAcervosSelecionados = [1, 2];

      render(<CheckboxSelecionarAcervo pesquisaAcervo={mockAcervoBase} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      expect(screen.getByText('Selecionar')).toBeInTheDocument();
    });

    test('renderiza com texto "Selecionado" e marcado quando o acervo está na lista', () => {
      mockAcervosSelecionados = [1, 42, 3];

      render(<CheckboxSelecionarAcervo pesquisaAcervo={mockAcervoBase} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
      expect(screen.getByText('Selecionado')).toBeInTheDocument();
    });

    test('fica desabilitado quando tem controle de disponibilidade e não está disponível', () => {
      const acervoIndisponivel = {
        ...mockAcervoBase,
        temControleDisponibilidade: true,
        estaDisponivel: false,
      };

      render(<CheckboxSelecionarAcervo pesquisaAcervo={acervoIndisponivel} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    test('fica habilitado quando não tem controle de disponibilidade', () => {
      const acervoSemControle = {
        ...mockAcervoBase,
        temControleDisponibilidade: false,
        estaDisponivel: false,
      };

      render(<CheckboxSelecionarAcervo pesquisaAcervo={acervoSemControle} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeDisabled();
    });

    test('fica habilitado quando tem controle de disponibilidade e está disponível', () => {
      const acervoDisponivel = {
        ...mockAcervoBase,
        temControleDisponibilidade: true,
        estaDisponivel: true,
      };

      render(<CheckboxSelecionarAcervo pesquisaAcervo={acervoDisponivel} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeDisabled();
    });
  });

  describe('Ação onChange (Seleção e Desseleção)', () => {
    test('adiciona o acervoId à lista quando o checkbox é marcado', () => {
      mockAcervosSelecionados = [10, 20];

      render(<CheckboxSelecionarAcervo pesquisaAcervo={mockAcervoBase} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(setAcervosSelecionados([10, 20, 42]));
    });

    test('remove o acervoId da lista quando o checkbox já selecionado é desmarcado', () => {
      mockAcervosSelecionados = [10, 42, 20];

      render(<CheckboxSelecionarAcervo pesquisaAcervo={mockAcervoBase} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(setAcervosSelecionados([10, 20]));
    });
  });
});
