import { AnyAction, configureStore, Reducer } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  CDEP_BUTTON_CONFIRMAR_REDEFINICAO_SENHA,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_CONFIRMAR_SENHA, CDEP_INPUT_SENHA } from '~/core/constants/ids/input';
import { ERRO_RECUPERACAO_SENHA } from '~/core/constants/mensagens';
import { PerfilUsuarioDTO } from '~/core/dto/perfil-usuario-dto';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { RetornoPerfilUsuarioDTO } from '~/core/dto/retorno-perfil-usuario-dto';
import { ROUTES } from '~/core/enum/routes';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';
import perfilReducer from '~/core/redux/modules/perfil/reducers';
import spinReducer from '~/core/redux/modules/spin/reducers';
import usuarioService from '~/core/services/usuario-service';
import { validarAutenticacao } from '~/core/utils/perfil';
import RedefinirSenhaToken from './index';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    tokenRecuperacaoSenhaEstaValido: jest.fn(),
    alterarSenhaComTokenRecuperacao: jest.fn(),
  },
}));

jest.mock('~/core/utils/perfil', () => ({
  validarAutenticacao: jest.fn(),
}));

const mockedValidarToken = usuarioService.tokenRecuperacaoSenhaEstaValido as jest.MockedFunction<
  typeof usuarioService.tokenRecuperacaoSenhaEstaValido
>;
const mockedAlterarSenha = usuarioService.alterarSenhaComTokenRecuperacao as jest.MockedFunction<
  typeof usuarioService.alterarSenhaComTokenRecuperacao
>;
const mockedValidarAutenticacao = validarAutenticacao as jest.MockedFunction<
  typeof validarAutenticacao
>;

const renderRedefinirSenhaToken = (options?: {
  token?: string;
  perfilSelecionado?: PerfilUsuarioDTO;
}) => {
  const store = configureStore({
    reducer: {
      spin: spinReducer as unknown as Reducer<{ spinning: boolean }, AnyAction>,
      perfil: perfilReducer as unknown as Reducer<
        { perfilUsuario: PerfilUsuarioDTO[]; perfilSelecionado?: PerfilUsuarioDTO },
        AnyAction
      >,
    },
    preloadedState: {
      spin: { spinning: false },
      perfil: {
        perfilUsuario: options?.perfilSelecionado ? [options.perfilSelecionado] : [],
        perfilSelecionado: options?.perfilSelecionado,
      },
    },
  });

  const initialPath = options?.token
    ? `/redefinir-senha/${options.token}`
    : '/redefinir-senha-sem-token';

  const utils = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path='/redefinir-senha/:token' element={<RedefinirSenhaToken />} />
          <Route path='/redefinir-senha-sem-token' element={<RedefinirSenhaToken />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

  return { store, ...utils };
};

describe('Página Redefinir Senha com Token (src/pages/redefinir-senha-token/index.tsx)', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockedValidarToken.mockReset();
    mockedAlterarSenha.mockReset();
    mockedValidarAutenticacao.mockReset();
  });

  it('C07: renderiza TokenExpirado imediatamente quando não há token nos parâmetros da rota', () => {
    renderRedefinirSenhaToken();

    expect(mockedValidarToken).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        'Este link expirou, utilize a opção "Esqueci minha senha" para solicitar um novo link.',
      ),
    ).toBeInTheDocument();
  });

  it('C08: exibe estado de carregamento enquanto valida o token e renderiza o formulário quando o token é válido (200 OK e data=true)', async () => {
    let resolveToken!: (value: AxiosResponse<boolean>) => void;
    mockedValidarToken.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveToken = resolve;
        }),
    );

    const { container } = renderRedefinirSenhaToken({ token: 'token-valido-abc' });

    expect(mockedValidarToken).toHaveBeenCalledWith('token-valido-abc');
    expect(screen.getByText('Validando token...')).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_INPUT_SENHA}`)).not.toBeInTheDocument();

    resolveToken({
      status: HttpStatusCode.Ok,
      data: true,
    } as AxiosResponse<boolean>);

    await waitFor(() => {
      expect(container.querySelector(`#${CDEP_INPUT_SENHA}`)).toBeInTheDocument();
    });
    expect(container.querySelector(`#${CDEP_INPUT_CONFIRMAR_SENHA}`)).toBeInTheDocument();
    expect(
      container.querySelector(`#${CDEP_BUTTON_CONFIRMAR_REDEFINICAO_SENHA}`),
    ).toBeInTheDocument();
  });

  it('C09: renderiza TokenExpirado quando a validação retorna data=false ou quando a requisição falha (catch)', async () => {
    mockedValidarToken.mockResolvedValueOnce({
      status: HttpStatusCode.Ok,
      data: false,
    } as AxiosResponse<boolean>);

    const { unmount } = renderRedefinirSenhaToken({ token: 'token-falso' });

    await waitFor(() => {
      expect(
        screen.getByText(
          'Este link expirou, utilize a opção "Esqueci minha senha" para solicitar um novo link.',
        ),
      ).toBeInTheDocument();
    });

    unmount();

    mockedValidarToken.mockRejectedValueOnce({
      response: {
        status: 400,
        data: 'Token inválido',
      },
    } as unknown as AxiosError<RetornoBaseDTO>);

    renderRedefinirSenhaToken({ token: 'token-erro' });

    await waitFor(() => {
      expect(
        screen.getByText(
          'Este link expirou, utilize a opção "Esqueci minha senha" para solicitar um novo link.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('C10: impede submissão quando novaSenha e confirmarSenha divergem', async () => {
    mockedValidarToken.mockResolvedValueOnce({
      status: HttpStatusCode.Ok,
      data: true,
    } as AxiosResponse<boolean>);

    const { container } = renderRedefinirSenhaToken({ token: 'token-valido' });

    await waitFor(() => {
      expect(container.querySelector(`#${CDEP_INPUT_SENHA}`)).toBeInTheDocument();
    });

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_SENHA}`)!, {
      target: { value: 'Senha@123' },
    });
    fireEvent.change(container.querySelector(`#${CDEP_INPUT_CONFIRMAR_SENHA}`)!, {
      target: { value: 'Outra@123' },
    });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CONFIRMAR_REDEFINICAO_SENHA}`)!);

    await waitFor(() => {
      expect(screen.getByText('Senhas não correspondem')).toBeInTheDocument();
    });
    expect(mockedAlterarSenha).not.toHaveBeenCalled();
  });

  it('C11: altera a senha com sucesso (status 200 OK), chama validarAutenticacao e redireciona para ROUTES.PRINCIPAL (e ignora se status != 200)', async () => {
    mockedValidarToken.mockResolvedValueOnce({
      status: HttpStatusCode.Ok,
      data: true,
    } as AxiosResponse<boolean>);

    const mockRetornoPerfil: RetornoPerfilUsuarioDTO = {
      usuarioNome: 'Usuário Redefinido',
      usuarioLogin: '1234567',
      dataHoraExpiracao: '2026-12-31T23:59:59',
      token: 'novo-jwt',
      email: 'usuario@sme.prefeitura.sp.gov.br',
      autenticado: true,
      perfilUsuario: [],
    };

    mockedAlterarSenha.mockResolvedValueOnce({
      status: HttpStatusCode.Ok,
      data: mockRetornoPerfil,
    } as AxiosResponse<RetornoPerfilUsuarioDTO>);

    const { container, store } = renderRedefinirSenhaToken({ token: 'token-valido-123' });

    await waitFor(() => {
      expect(container.querySelector(`#${CDEP_INPUT_SENHA}`)).toBeInTheDocument();
    });

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_SENHA}`)!, {
      target: { value: 'Senha@123' },
    });
    fireEvent.change(container.querySelector(`#${CDEP_INPUT_CONFIRMAR_SENHA}`)!, {
      target: { value: 'Senha@123' },
    });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CONFIRMAR_REDEFINICAO_SENHA}`)!);

    await waitFor(() => {
      expect(mockedAlterarSenha).toHaveBeenCalledWith({
        novaSenha: 'Senha@123',
        token: 'token-valido-123',
      });
    });

    expect(mockedValidarAutenticacao).toHaveBeenCalledWith(mockRetornoPerfil);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
    expect(store.getState().spin.spinning).toBe(false);

    // Quando status !== 200 OK (ex: 204 NoContent), não autentica nem navega
    mockNavigate.mockClear();
    mockedValidarAutenticacao.mockClear();
    mockedAlterarSenha.mockResolvedValueOnce({
      status: HttpStatusCode.NoContent,
      data: mockRetornoPerfil,
    } as AxiosResponse<RetornoPerfilUsuarioDTO>);

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CONFIRMAR_REDEFINICAO_SENHA}`)!);

    await waitFor(() => {
      expect(mockedAlterarSenha).toHaveBeenCalledTimes(2);
    });
    expect(mockedValidarAutenticacao).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('C12: exibe mensagens de erro ao falhar alterarSenhaComTokenRecuperacao (string, mensagens[] e fallback ERRO_RECUPERACAO_SENHA)', async () => {
    mockedValidarToken.mockResolvedValueOnce({
      status: HttpStatusCode.Ok,
      data: true,
    } as AxiosResponse<boolean>);

    const { container } = renderRedefinirSenhaToken({ token: 'token-valido-erro' });

    await waitFor(() => {
      expect(container.querySelector(`#${CDEP_INPUT_SENHA}`)).toBeInTheDocument();
    });

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_SENHA}`)!, {
      target: { value: 'Senha@123' },
    });
    fireEvent.change(container.querySelector(`#${CDEP_INPUT_CONFIRMAR_SENHA}`)!, {
      target: { value: 'Senha@123' },
    });

    // 1) Erro string
    mockedAlterarSenha.mockRejectedValueOnce({
      response: {
        status: 400,
        data: 'Nova senha não pode ser igual à anterior',
      },
    } as unknown as AxiosError<RetornoBaseDTO>);

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CONFIRMAR_REDEFINICAO_SENHA}`)!);

    await waitFor(() => {
      expect(screen.getByText('Nova senha não pode ser igual à anterior')).toBeInTheDocument();
    });

    // 2) Erro mensagens[]
    mockedAlterarSenha.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          mensagens: ['Token já utilizado anteriormente'],
        },
      },
    } as AxiosError<RetornoBaseDTO>);

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CONFIRMAR_REDEFINICAO_SENHA}`)!);

    await waitFor(() => {
      expect(screen.getByText('Token já utilizado anteriormente')).toBeInTheDocument();
    });

    // 3) Fallback ERRO_RECUPERACAO_SENHA
    mockedAlterarSenha.mockRejectedValueOnce({
      response: {
        status: 500,
        data: {},
      },
    } as unknown as AxiosError<RetornoBaseDTO>);

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CONFIRMAR_REDEFINICAO_SENHA}`)!);

    await waitFor(() => {
      expect(screen.getByText(ERRO_RECUPERACAO_SENHA)).toBeInTheDocument();
    });
  });

  it('C13: navega para ROUTES.PRINCIPAL (perfil não-admin) ou ROUTES.INDICADORES (perfil admin) ao clicar em Voltar no formulário', async () => {
    mockedValidarToken.mockResolvedValue({
      status: HttpStatusCode.Ok,
      data: true,
    } as AxiosResponse<boolean>);

    const { container, unmount } = renderRedefinirSenhaToken({ token: 'token-voltar' });

    await waitFor(() => {
      expect(container.querySelector(`#${CDEP_BUTTON_VOLTAR}`)).toBeInTheDocument();
    });

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_VOLTAR}`)!);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);

    unmount();
    mockNavigate.mockClear();

    const { container: containerAdmin } = renderRedefinirSenhaToken({
      token: 'token-voltar-admin',
      perfilSelecionado: {
        perfil: TipoPerfil.ADMIN_MEMORIAL,
        perfilNome: 'Admin Memorial',
      },
    });

    await waitFor(() => {
      expect(containerAdmin.querySelector(`#${CDEP_BUTTON_VOLTAR}`)).toBeInTheDocument();
    });

    fireEvent.click(containerAdmin.querySelector(`#${CDEP_BUTTON_VOLTAR}`)!);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
  });
});
