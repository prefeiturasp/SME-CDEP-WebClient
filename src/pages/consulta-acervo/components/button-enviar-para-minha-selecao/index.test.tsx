import { render, screen, fireEvent } from '~/tests/test-utils';
import { ButtonEnviarParaMinhaSelecao } from './index';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { ROUTES } from '~/core/enum/routes';
import { setAcervosSelecionados } from '~/core/redux/modules/solicitacao/actions';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
let mockAcervosSelecionados: number[] = [];

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) =>
    selector({
      solicitacao: {
        acervosSelecionados: mockAcervosSelecionados,
      },
    }),
}));

describe('ButtonEnviarParaMinhaSelecao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAcervosSelecionados = [];
  });

  const mockAcervoBase: PesquisaAcervoDTO = {
    acervoId: 10,
    titulo: 'Livro Teste',
    estaDisponivel: true,
    temControleDisponibilidade: false,
  } as PesquisaAcervoDTO;

  describe('Renderização e Estilos', () => {
    test('renderiza o botão com o texto correto', () => {
      render(<ButtonEnviarParaMinhaSelecao pesquisaAcervo={mockAcervoBase} />);

      const button = screen.getByRole('button', {
        name: /enviar para a minha seleção/i,
      });
      expect(button).toBeInTheDocument();
    });

    test('aplica os estilos esperados no botão habilitado', () => {
      render(<ButtonEnviarParaMinhaSelecao pesquisaAcervo={mockAcervoBase} />);

      const button = screen.getByRole('button', {
        name: /enviar para a minha seleção/i,
      });
      expect(button).toHaveStyle({
        fontSize: '18px',
        height: '40px',
        borderRadius: '40px',
        display: 'flex',
        alignItems: 'center',
      });
    });

    test('aplica o estilo de fundo desabilitado quando disabled for true', () => {
      render(
        <ButtonEnviarParaMinhaSelecao
          pesquisaAcervo={{
            ...mockAcervoBase,
            temControleDisponibilidade: true,
            estaDisponivel: false,
          }}
        />,
      );

      const button = screen.getByRole('button', {
        name: /enviar para a minha seleção/i,
      });
      expect(button).toBeDisabled();
      expect(button).toHaveStyle({
        background: '#efefef',
      });
    });
  });

  describe('Regras de desabilitação do botão', () => {
    test('fica desabilitado quando tem controle de disponibilidade e não está disponível', () => {
      render(
        <ButtonEnviarParaMinhaSelecao
          pesquisaAcervo={{
            ...mockAcervoBase,
            temControleDisponibilidade: true,
            estaDisponivel: false,
          }}
        />,
      );

      const button = screen.getByRole('button', {
        name: /enviar para a minha seleção/i,
      });
      expect(button).toBeDisabled();
    });

    test('fica desabilitado quando não há acervos selecionados e pesquisaAcervo não é informado', () => {
      mockAcervosSelecionados = [];
      render(<ButtonEnviarParaMinhaSelecao />);

      const button = screen.getByRole('button', {
        name: /enviar para a minha seleção/i,
      });
      expect(button).toBeDisabled();
    });

    test('fica desabilitado quando não há acervos selecionados e pesquisaAcervo não possui acervoId', () => {
      mockAcervosSelecionados = [];
      const acervoSemId = {
        ...mockAcervoBase,
        acervoId: undefined,
      } as unknown as PesquisaAcervoDTO;

      render(<ButtonEnviarParaMinhaSelecao pesquisaAcervo={acervoSemId} />);

      const button = screen.getByRole('button', {
        name: /enviar para a minha seleção/i,
      });
      expect(button).toBeDisabled();
    });

    test('fica habilitado quando pesquisaAcervo tem acervoId e não tem controle de disponibilidade', () => {
      render(
        <ButtonEnviarParaMinhaSelecao
          pesquisaAcervo={{
            ...mockAcervoBase,
            temControleDisponibilidade: false,
          }}
        />,
      );

      const button = screen.getByRole('button', {
        name: /enviar para a minha seleção/i,
      });
      expect(button).not.toBeDisabled();
    });

    test('fica habilitado quando tem controle de disponibilidade e está disponível', () => {
      render(
        <ButtonEnviarParaMinhaSelecao
          pesquisaAcervo={{
            ...mockAcervoBase,
            temControleDisponibilidade: true,
            estaDisponivel: true,
          }}
        />,
      );

      const button = screen.getByRole('button', {
        name: /enviar para a minha seleção/i,
      });
      expect(button).not.toBeDisabled();
    });

    test('fica habilitado quando não há pesquisaAcervo, mas já existem acervos selecionados na lista', () => {
      mockAcervosSelecionados = [1, 2];
      render(<ButtonEnviarParaMinhaSelecao />);

      const button = screen.getByRole('button', {
        name: /enviar para a minha seleção/i,
      });
      expect(button).not.toBeDisabled();
    });
  });

  describe('Ação de clique (onClick)', () => {
    test('adiciona acervo aos selecionados e navega para a rota de solicitação quando acervo não está na lista', () => {
      mockAcervosSelecionados = [1, 2];
      const novoAcervo = { ...mockAcervoBase, acervoId: 3 };

      render(<ButtonEnviarParaMinhaSelecao pesquisaAcervo={novoAcervo} />);

      const button = screen.getByRole('button', {
        name: /enviar para a minha seleção/i,
      });
      fireEvent.click(button);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(setAcervosSelecionados([1, 2, 3]));
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SOLICITACAO);
    });

    test('não adiciona acervo novamente quando acervo já está na lista de selecionados, mas realiza a navegação', () => {
      mockAcervosSelecionados = [1, 2, 10];

      render(<ButtonEnviarParaMinhaSelecao pesquisaAcervo={mockAcervoBase} />);

      const button = screen.getByRole('button', {
        name: /enviar para a minha seleção/i,
      });
      fireEvent.click(button);

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SOLICITACAO);
    });

    test('apenas navega para a rota de solicitação se pesquisaAcervo não for fornecido', () => {
      mockAcervosSelecionados = [5, 6];

      render(<ButtonEnviarParaMinhaSelecao />);

      const button = screen.getByRole('button', {
        name: /enviar para a minha seleção/i,
      });
      fireEvent.click(button);

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SOLICITACAO);
    });
  });
});
