import { AnyAction, configureStore, Reducer } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosError, AxiosResponse } from 'axios';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
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
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { RetornoPerfilUsuarioDTO } from '~/core/dto/retorno-perfil-usuario-dto';
import { ROUTES } from '~/core/enum/routes';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';
import solicitacaoReducer from '~/core/redux/modules/solicitacao/reducers';
import spinReducer from '~/core/redux/modules/spin/reducers';
import autenticacaoService from '~/core/services/autenticacao-service';
import { validarAutenticacao } from '~/core/utils/perfil';
import Login from './index';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock('~/core/services/autenticacao-service', () => ({
  __esModule: true,
  default: {
    autenticar: jest.fn(),
  },
}));

jest.mock('~/core/utils/perfil', () => ({
  validarAutenticacao: jest.fn(),
}));

const mockedAutenticar = autenticacaoService.autenticar as jest.MockedFunction<
  typeof autenticacaoService.autenticar
>;
const mockedValidarAutenticacao = validarAutenticacao as jest.MockedFunction<
  typeof validarAutenticacao
>;

const createTestStore = (acervosSelecionados: any[] = []) =>
  configureStore({
    reducer: {
      spin: spinReducer as unknown as Reducer<{ spinning: boolean }, AnyAction>,
      solicitacao: solicitacaoReducer as unknown as Reducer<
        { acervosSelecionados: any[] },
        AnyAction
      >,
    },
    preloadedState: {
      spin: { spinning: false },
      solicitacao: { acervosSelecionados },
    },
  });

const renderLogin = (acervosSelecionados: any[] = []) => {
  const store = createTestStore(acervosSelecionados);
  const utils = render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>,
  );
  return { store, ...utils };
};

describe('Página de Login (src/pages/login/index.tsx)', () => {
  const mockRetornoAutenticado: RetornoPerfilUsuarioDTO = {
    usuarioNome: 'Usuário Teste',
    usuarioLogin: '1234567',
    dataHoraExpiracao: '2026-12-31T23:59:59',
    token: 'jwt-token-valido',
    email: 'usuario@sme.prefeitura.sp.gov.br',
    autenticado: true,
    perfilUsuario: [
      {
        perfil: TipoPerfil.EXTERNO,
        perfilNome: 'Externo',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.clarity = jest.fn();
  });

  it('C01: renderiza os campos de login, senha e botões de ação sem exibir erros inicialmente', () => {
    const { container } = renderLogin();

    expect(container.querySelector(`#${CDEP_INPUT_LOGIN}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_INPUT_SENHA}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_BUTTON_ACESSAR}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_BUTTON_ESQUECI_SENHA}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_BUTTON_CRIAR_CONTA}`)).toBeInTheDocument();
    expect(screen.queryByText(ERRO_INFORMAR_USUARIO_SENHA)).not.toBeInTheDocument();
  });

  it('C02: exibe ERRO_INFORMAR_USUARIO_SENHA ao submeter o formulário com login e senha em branco', async () => {
    const { container } = renderLogin();

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_ACESSAR}`)!);

    await waitFor(() => {
      expect(screen.getByText(ERRO_INFORMAR_USUARIO_SENHA)).toBeInTheDocument();
    });
    expect(mockedAutenticar).not.toHaveBeenCalled();
  });

  it('C03: não exibe ERRO_INFORMAR_USUARIO_SENHA no onFinishFailed quando ao menos um dos campos foi preenchido', async () => {
    const { container } = renderLogin();

    const inputLogin = container.querySelector(`#${CDEP_INPUT_LOGIN}`)!;
    fireEvent.change(inputLogin, { target: { value: '12345' } });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_ACESSAR}`)!);

    await waitFor(() => {
      expect(screen.getByText(/Campo obrigatório/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(ERRO_INFORMAR_USUARIO_SENHA)).not.toBeInTheDocument();
    expect(mockedAutenticar).not.toHaveBeenCalled();
  });

  it('C04: autentica usuário com perfil não-admin sem acervos selecionados e redireciona para ROUTES.PRINCIPAL', async () => {
    mockedAutenticar.mockResolvedValueOnce({
      data: mockRetornoAutenticado,
    } as AxiosResponse<RetornoPerfilUsuarioDTO>);
    mockedValidarAutenticacao.mockReturnValueOnce({
      perfil: TipoPerfil.EXTERNO,
      perfilNome: 'Externo',
    });

    const { container, store } = renderLogin([]);

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_LOGIN}`)!, {
      target: { value: '1234567' },
    });
    fireEvent.change(container.querySelector(`#${CDEP_INPUT_SENHA}`)!, {
      target: { value: 'senha123' },
    });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_ACESSAR}`)!);

    await waitFor(() => {
      expect(mockedAutenticar).toHaveBeenCalledWith({
        login: '1234567',
        senha: 'senha123',
      });
    });

    expect(window.clarity).toHaveBeenCalledWith('identify', '1234567');
    expect(mockedValidarAutenticacao).toHaveBeenCalledWith(mockRetornoAutenticado);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
    });
    expect(store.getState().spin.spinning).toBe(false);
  });

  it('C05: autentica usuário com perfil administrador sem acervos selecionados e redireciona para ROUTES.INDICADORES', async () => {
    mockedAutenticar.mockResolvedValueOnce({
      data: {
        ...mockRetornoAutenticado,
        perfilUsuario: [{ perfil: TipoPerfil.ADMIN_GERAL, perfilNome: 'Admin Geral' }],
      },
    } as AxiosResponse<RetornoPerfilUsuarioDTO>);
    mockedValidarAutenticacao.mockReturnValueOnce({
      perfil: TipoPerfil.ADMIN_GERAL,
      perfilNome: 'Admin Geral',
    });

    const { container } = renderLogin([]);

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_LOGIN}`)!, {
      target: { value: 'admin123' },
    });
    fireEvent.change(container.querySelector(`#${CDEP_INPUT_SENHA}`)!, {
      target: { value: 'senha123' },
    });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_ACESSAR}`)!);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
    });
  });

  it('C06: redireciona para ROUTES.SOLICITACAO quando há acervos selecionados na store, mesmo para perfil admin', async () => {
    mockedAutenticar.mockResolvedValueOnce({
      data: mockRetornoAutenticado,
    } as AxiosResponse<RetornoPerfilUsuarioDTO>);
    mockedValidarAutenticacao.mockReturnValueOnce({
      perfil: TipoPerfil.ADMIN_BIBLIOTECA,
      perfilNome: 'Admin Biblioteca',
    });

    const { container } = renderLogin([{ id: 10, titulo: 'Livro CDEP' }]);

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_LOGIN}`)!, {
      target: { value: 'admin123' },
    });
    fireEvent.change(container.querySelector(`#${CDEP_INPUT_SENHA}`)!, {
      target: { value: 'senha123' },
    });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_ACESSAR}`)!);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SOLICITACAO);
    });
  });

  it('C07: não executa clarity, validarAutenticacao nem redirecionamento quando autenticado é false na resposta', async () => {
    mockedAutenticar.mockResolvedValueOnce({
      data: {
        ...mockRetornoAutenticado,
        autenticado: false,
      },
    } as AxiosResponse<RetornoPerfilUsuarioDTO>);

    const { container, store } = renderLogin();

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_LOGIN}`)!, {
      target: { value: '1234567' },
    });
    fireEvent.change(container.querySelector(`#${CDEP_INPUT_SENHA}`)!, {
      target: { value: 'senha123' },
    });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_ACESSAR}`)!);

    await waitFor(() => {
      expect(mockedAutenticar).toHaveBeenCalledTimes(1);
    });

    expect(window.clarity).not.toHaveBeenCalled();
    expect(mockedValidarAutenticacao).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(store.getState().spin.spinning).toBe(false);
  });

  it('C08: exibe ERRO_LOGIN_SENHA_INCORRETOS quando a API retorna status 401', async () => {
    const erro401 = {
      response: {
        status: 401,
        data: {},
      },
    } as AxiosError<RetornoBaseDTO>;
    mockedAutenticar.mockRejectedValueOnce(erro401);

    const { container } = renderLogin();

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_LOGIN}`)!, {
      target: { value: '1234567' },
    });
    fireEvent.change(container.querySelector(`#${CDEP_INPUT_SENHA}`)!, {
      target: { value: 'senhaErrada' },
    });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_ACESSAR}`)!);

    await waitFor(() => {
      expect(screen.getByText(ERRO_LOGIN_SENHA_INCORRETOS)).toBeInTheDocument();
    });
  });

  it('C09: exibe mensagem de erro quando response.data é uma string ou um objeto com lista de mensagens', async () => {
    const erroString = {
      response: {
        status: 400,
        data: 'Usuário bloqueado temporariamente',
      },
    } as unknown as AxiosError<RetornoBaseDTO>;
    mockedAutenticar.mockRejectedValueOnce(erroString);

    const { container } = renderLogin();

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_LOGIN}`)!, {
      target: { value: '1234567' },
    });
    fireEvent.change(container.querySelector(`#${CDEP_INPUT_SENHA}`)!, {
      target: { value: 'senha123' },
    });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_ACESSAR}`)!);

    await waitFor(() => {
      expect(screen.getByText('Usuário bloqueado temporariamente')).toBeInTheDocument();
    });

    const erroMensagens = {
      response: {
        status: 400,
        data: {
          mensagens: ['Credencial expirada', 'Solicite novo acesso'],
        },
      },
    } as AxiosError<RetornoBaseDTO>;
    mockedAutenticar.mockRejectedValueOnce(erroMensagens);

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_ACESSAR}`)!);

    await waitFor(() => {
      expect(screen.getByText('Credencial expirada')).toBeInTheDocument();
      expect(screen.getByText('Solicite novo acesso')).toBeInTheDocument();
    });
  });

  it('C10: exibe ERRO_LOGIN padrão quando a falha não possui status 401 nem mensagens estruturadas', async () => {
    const erroGenerico = {
      response: {
        status: 500,
        data: { mensagens: [] },
      },
    } as unknown as AxiosError<RetornoBaseDTO>;
    mockedAutenticar.mockRejectedValueOnce(erroGenerico);

    const { container } = renderLogin();

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_LOGIN}`)!, {
      target: { value: '1234567' },
    });
    fireEvent.change(container.querySelector(`#${CDEP_INPUT_SENHA}`)!, {
      target: { value: 'senha123' },
    });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_ACESSAR}`)!);

    await waitFor(() => {
      expect(screen.getByText(ERRO_LOGIN)).toBeInTheDocument();
    });
  });

  it('C11: navega para ROUTES.CRIAR_CONTA e ROUTES.REDEFINIR_SENHA (enviando o login atual no state)', () => {
    const { container } = renderLogin();

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_LOGIN}`)!, {
      target: { value: 'usuario.sme' },
    });

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_ESQUECI_SENHA}`)!);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.REDEFINIR_SENHA, {
      state: 'usuario.sme',
    });

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CRIAR_CONTA}`)!);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CRIAR_CONTA);
  });
});
