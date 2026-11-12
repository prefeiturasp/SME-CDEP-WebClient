import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  CDEP_BUTTON_ACESSAR,
  CDEP_BUTTON_CRIAR_CONTA,
  CDEP_BUTTON_ESQUECI_SENHA,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_LOGIN, CDEP_INPUT_SENHA } from '~/core/constants/ids/input';
import {
  ERRO_INFORMAR_USUARIO_SENHA,
  ERRO_LOGIN,
  ERRO_LOGIN_SENHA_INCORRETOS,
} from '~/core/constants/mensagens';
import { ROUTES } from '~/core/enum/routes';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';
import autenticacaoService from '~/core/services/autenticacao-service';
import { validarAutenticacao } from '~/core/utils/perfil';
import Login from './index';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
let mockSolicitacaoState: { acervosSelecionados: any[] } = { acervosSelecionados: [] };

jest.mock('~/core/hooks/use-redux', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => selector({ solicitacao: mockSolicitacaoState }),
}));

jest.mock('~/core/services/autenticacao-service', () => ({
  __esModule: true,
  default: {
    autenticar: jest.fn(),
  },
}));

jest.mock('~/core/utils/perfil', () => ({
  validarAutenticacao: jest.fn(),
}));

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSolicitacaoState = { acervosSelecionados: [] };
    (window as any).clarity = jest.fn();
  });

  const preencherFormulario = (login = 'usuario.teste', senha = 'senhaValida123') => {
    const inputLogin = document.getElementById(CDEP_INPUT_LOGIN)!;
    const inputSenha = document.getElementById(CDEP_INPUT_SENHA)!;

    fireEvent.change(inputLogin, { target: { value: login } });
    fireEvent.change(inputSenha, { target: { value: senha } });
  };

  describe('Renderização Inicial', () => {
    it('deve renderizar campos de login, senha e todos os botões de ação', () => {
      render(<Login />);

      expect(document.getElementById(CDEP_INPUT_LOGIN)).toBeInTheDocument();
      expect(document.getElementById(CDEP_INPUT_SENHA)).toBeInTheDocument();
      expect(document.getElementById(CDEP_BUTTON_ACESSAR)).toBeInTheDocument();
      expect(document.getElementById(CDEP_BUTTON_ESQUECI_SENHA)).toBeInTheDocument();
      expect(document.getElementById(CDEP_BUTTON_CRIAR_CONTA)).toBeInTheDocument();

      expect(screen.queryByText(ERRO_INFORMAR_USUARIO_SENHA)).not.toBeInTheDocument();
    });
  });

  describe('Navegação dos botões externos', () => {
    it('deve navegar para a tela de criar conta ao clicar no botão correspondente', () => {
      render(<Login />);

      fireEvent.click(document.getElementById(CDEP_BUTTON_CRIAR_CONTA)!);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CRIAR_CONTA);
    });

    it('deve navegar para a tela de redefinir senha enviando o login preenchido no state', () => {
      render(<Login />);

      const inputLogin = document.getElementById(CDEP_INPUT_LOGIN)!;
      fireEvent.change(inputLogin, { target: { value: 'login.informado' } });

      fireEvent.click(document.getElementById(CDEP_BUTTON_ESQUECI_SENHA)!);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.REDEFINIR_SENHA, {
        state: 'login.informado',
      });
    });
  });

  describe('Validação do formulário (onFinishFailed)', () => {
    it('deve exibir mensagem de erro quando submetido com ambos os campos vazios', async () => {
      render(<Login />);

      fireEvent.click(document.getElementById(CDEP_BUTTON_ACESSAR)!);

      await waitFor(() => {
        expect(screen.getByText(ERRO_INFORMAR_USUARIO_SENHA)).toBeInTheDocument();
      });
    });

    it('não deve exibir mensagem ERRO_INFORMAR_USUARIO_SENHA se apenas um dos campos estiver preenchido', async () => {
      render(<Login />);

      const inputLogin = document.getElementById(CDEP_INPUT_LOGIN)!;
      fireEvent.change(inputLogin, { target: { value: 'usuario' } });

      fireEvent.click(document.getElementById(CDEP_BUTTON_ACESSAR)!);

      await waitFor(() => {
        expect(screen.queryByText(ERRO_INFORMAR_USUARIO_SENHA)).not.toBeInTheDocument();
      });
    });
  });

  describe('Autenticação com Sucesso (onFinish)', () => {
    it('deve navegar para ROUTES.SOLICITACAO quando houver acervos selecionados no estado', async () => {
      mockSolicitacaoState = { acervosSelecionados: [{ id: 1, titulo: 'Acervo 1' }] };

      (autenticacaoService.autenticar as jest.Mock).mockResolvedValueOnce({
        data: {
          autenticado: true,
          usuarioLogin: 'usuario.acervo',
        },
      });
      (validarAutenticacao as jest.Mock).mockReturnValueOnce({
        perfil: TipoPerfil.EXTERNO,
      });

      render(<Login />);
      preencherFormulario();

      fireEvent.click(document.getElementById(CDEP_BUTTON_ACESSAR)!);

      await waitFor(() => {
        expect(window.clarity).toHaveBeenCalledWith('identify', 'usuario.acervo');
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SOLICITACAO);
      });

      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: true }));
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: false }));
    });

    it('deve navegar para ROUTES.INDICADORES quando o usuário for perfil admin e não tiver acervos selecionados', async () => {
      mockSolicitacaoState = { acervosSelecionados: [] };

      (autenticacaoService.autenticar as jest.Mock).mockResolvedValueOnce({
        data: {
          autenticado: true,
          usuarioLogin: 'admin.geral',
        },
      });
      (validarAutenticacao as jest.Mock).mockReturnValueOnce({
        perfil: TipoPerfil.ADMIN_GERAL,
      });

      render(<Login />);
      preencherFormulario();

      fireEvent.click(document.getElementById(CDEP_BUTTON_ACESSAR)!);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
      });
    });

    it('deve navegar para ROUTES.PRINCIPAL quando o usuário não for admin e não tiver acervos selecionados', async () => {
      mockSolicitacaoState = { acervosSelecionados: [] };

      (autenticacaoService.autenticar as jest.Mock).mockResolvedValueOnce({
        data: {
          autenticado: true,
          usuarioLogin: 'solicitante.comum',
        },
      });
      (validarAutenticacao as jest.Mock).mockReturnValueOnce({
        perfil: TipoPerfil.EXTERNO,
      });

      render(<Login />);
      preencherFormulario();

      fireEvent.click(document.getElementById(CDEP_BUTTON_ACESSAR)!);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
      });
    });

    it('deve navegar para ROUTES.PRINCIPAL se perfilSelecionado for nulo/indefinido', async () => {
      mockSolicitacaoState = { acervosSelecionados: [] };

      (autenticacaoService.autenticar as jest.Mock).mockResolvedValueOnce({
        data: {
          autenticado: true,
          usuarioLogin: 'sem.perfil',
        },
      });
      (validarAutenticacao as jest.Mock).mockReturnValueOnce(undefined);

      render(<Login />);
      preencherFormulario();

      fireEvent.click(document.getElementById(CDEP_BUTTON_ACESSAR)!);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
      });
    });

    it('não deve redirecionar se resposta.data.autenticado for falso', async () => {
      (autenticacaoService.autenticar as jest.Mock).mockResolvedValueOnce({
        data: {
          autenticado: false,
        },
      });

      render(<Login />);
      preencherFormulario();

      fireEvent.click(document.getElementById(CDEP_BUTTON_ACESSAR)!);

      await waitFor(() => {
        expect(autenticacaoService.autenticar).toHaveBeenCalled();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(window.clarity).not.toHaveBeenCalled();
    });
  });

  describe('Tratamento de Erros de Autenticação (validarExibirErros)', () => {
    it('deve exibir ERRO_LOGIN_SENHA_INCORRETOS quando o status da resposta for 401', async () => {
      (autenticacaoService.autenticar as jest.Mock).mockRejectedValueOnce({
        response: {
          status: 401,
        },
      });

      render(<Login />);
      preencherFormulario();

      fireEvent.click(document.getElementById(CDEP_BUTTON_ACESSAR)!);

      await waitFor(() => {
        expect(screen.getByText(ERRO_LOGIN_SENHA_INCORRETOS)).toBeInTheDocument();
      });
    });

    it('deve exibir mensagem em texto simples quando response.data for uma string', async () => {
      const mensagemErroString = 'Sua conta está inativa no sistema.';
      (autenticacaoService.autenticar as jest.Mock).mockRejectedValueOnce({
        response: {
          status: 400,
          data: mensagemErroString,
        },
      });

      render(<Login />);
      preencherFormulario();

      fireEvent.click(document.getElementById(CDEP_BUTTON_ACESSAR)!);

      await waitFor(() => {
        expect(screen.getByText(mensagemErroString)).toBeInTheDocument();
      });
    });

    it('deve exibir lista de mensagens quando response.data contiver array de mensagens', async () => {
      const mensagensErro = ['Erro de autenticação 1', 'Erro de autenticação 2'];
      (autenticacaoService.autenticar as jest.Mock).mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            mensagens: mensagensErro,
          },
        },
      });

      render(<Login />);
      preencherFormulario();

      fireEvent.click(document.getElementById(CDEP_BUTTON_ACESSAR)!);

      await waitFor(() => {
        expect(screen.getByText('Erro de autenticação 1')).toBeInTheDocument();
        expect(screen.getByText('Erro de autenticação 2')).toBeInTheDocument();
      });
    });

    it('deve exibir ERRO_LOGIN como fallback quando o erro não possuir formato específico', async () => {
      (autenticacaoService.autenticar as jest.Mock).mockRejectedValueOnce({
        response: {
          status: 500,
          data: {},
        },
      });

      render(<Login />);
      preencherFormulario();

      fireEvent.click(document.getElementById(CDEP_BUTTON_ACESSAR)!);

      await waitFor(() => {
        expect(screen.getByText(ERRO_LOGIN)).toBeInTheDocument();
      });
    });
  });
});
