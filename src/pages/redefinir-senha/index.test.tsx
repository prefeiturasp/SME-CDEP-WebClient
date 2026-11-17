import { AnyAction, configureStore, Reducer } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosError, AxiosResponse } from 'axios';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { CDEP_BUTTON_CONTINUAR, CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_LOGIN } from '~/core/constants/ids/input';
import { ERRO_RECUPERACAO_SENHA } from '~/core/constants/mensagens';
import { PerfilUsuarioDTO } from '~/core/dto/perfil-usuario-dto';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { ROUTES } from '~/core/enum/routes';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';
import perfilReducer from '~/core/redux/modules/perfil/reducers';
import spinReducer from '~/core/redux/modules/spin/reducers';
import usuarioService from '~/core/services/usuario-service';
import RedefinirSenha from './index';

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
    solicitarRecuperacaoSenha: jest.fn(),
  },
}));

const mockedSolicitarRecuperacao = usuarioService.solicitarRecuperacaoSenha as jest.MockedFunction<
  typeof usuarioService.solicitarRecuperacaoSenha
>;

const renderRedefinirSenha = (options?: {
  locationState?: string;
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

  const initialEntries = [
    {
      pathname: ROUTES.REDEFINIR_SENHA,
      state: options?.locationState,
    },
  ];

  const utils = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <RedefinirSenha />
      </MemoryRouter>
    </Provider>,
  );

  return { store, ...utils };
};

describe('Página Redefinir Senha (src/pages/redefinir-senha/index.tsx)', () => {
  jest.setTimeout(30000);

  beforeEach(() => {
    mockNavigate.mockReset();
    mockedSolicitarRecuperacao.mockReset();
  });

  it('C01: renderiza input vazio e botão Continuar desabilitado sem location.state, e pré-preenchido/habilitado quando location.state é informado', async () => {
    const { container, unmount } = renderRedefinirSenha();

    const inputSemState = container.querySelector(`#${CDEP_INPUT_LOGIN}`) as HTMLInputElement;
    const botaoSemState = container.querySelector(`#${CDEP_BUTTON_CONTINUAR}`) as HTMLButtonElement;

    expect(inputSemState).toHaveValue('');
    expect(botaoSemState).toBeDisabled();

    unmount();

    const { container: containerComState } = renderRedefinirSenha({
      locationState: 'usuario.inicial',
    });

    await waitFor(() => {
      expect(containerComState.querySelector(`#${CDEP_INPUT_LOGIN}`)).toHaveValue(
        'usuario.inicial',
      );
      expect(containerComState.querySelector(`#${CDEP_BUTTON_CONTINUAR}`)).not.toBeDisabled();
    });
  });

  it('C02: impede a submissão quando o login possui menos de 5 caracteres', async () => {
    const { container } = renderRedefinirSenha();

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_LOGIN}`)!, {
      target: { value: '1234' },
    });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CONTINUAR}`)!);

    await waitFor(
      () => {
        expect(screen.getByText(/Deve conter no mínimo 5 caracteres/i)).toBeInTheDocument();
      },
      { timeout: 10000 },
    );
    expect(mockedSolicitarRecuperacao).not.toHaveBeenCalled();
  });

  it('C03: submete login válido, abre modal com a mensagem de confirmação e permite fechar o modal', async () => {
    mockedSolicitarRecuperacao.mockResolvedValueOnce({
      data: 'Enviamos um link de recuperação para seu e-mail cadastrado.',
    } as AxiosResponse<string>);

    const { container, store } = renderRedefinirSenha();

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_LOGIN}`)!, {
      target: { value: '1234567' },
    });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CONTINUAR}`)!);

    await waitFor(() => {
      expect(mockedSolicitarRecuperacao).toHaveBeenCalledWith('1234567');
    });

    await waitFor(() => {
      expect(
        screen.getByText('Enviamos um link de recuperação para seu e-mail cadastrado.'),
      ).toBeInTheDocument();
    });
    expect(store.getState().spin.spinning).toBe(false);

    const closeButton = document.querySelector('.ant-modal-close') as HTMLElement;
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText('Enviamos um link de recuperação para seu e-mail cadastrado.'),
      ).not.toBeInTheDocument();
    });
  });

  it('C04: não abre o modal quando solicitarRecuperacaoSenha retorna data vazio', async () => {
    mockedSolicitarRecuperacao.mockResolvedValueOnce({
      data: '',
    } as AxiosResponse<string>);

    const { container } = renderRedefinirSenha({ locationState: '1234567' });

    await waitFor(() => {
      expect(container.querySelector(`#${CDEP_BUTTON_CONTINUAR}`)).not.toBeDisabled();
    });

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CONTINUAR}`)!);

    await waitFor(() => {
      expect(mockedSolicitarRecuperacao).toHaveBeenCalledWith('1234567');
    });
    expect(document.querySelector('.ant-modal')).not.toBeInTheDocument();
  });

  it('C05: exibe erros via validarExibirErros (data string, array mensagens e fallback ERRO_RECUPERACAO_SENHA)', async () => {
    const { container } = renderRedefinirSenha({ locationState: '1234567' });

    await waitFor(() => {
      expect(container.querySelector(`#${CDEP_BUTTON_CONTINUAR}`)).not.toBeDisabled();
    });

    // 1) Erro string
    mockedSolicitarRecuperacao.mockRejectedValueOnce({
      response: {
        status: 400,
        data: 'Usuário não localizado',
      },
    } as unknown as AxiosError<RetornoBaseDTO>);

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CONTINUAR}`)!);

    await waitFor(() => {
      expect(screen.getByText('Usuário não localizado')).toBeInTheDocument();
    });

    // 2) Erro com array mensagens
    mockedSolicitarRecuperacao.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          mensagens: ['E-mail de recuperação indisponível'],
        },
      },
    } as AxiosError<RetornoBaseDTO>);

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CONTINUAR}`)!);

    await waitFor(() => {
      expect(screen.getByText('E-mail de recuperação indisponível')).toBeInTheDocument();
    });

    // 3) Fallback ERRO_RECUPERACAO_SENHA
    mockedSolicitarRecuperacao.mockRejectedValueOnce({
      response: {
        status: 500,
        data: {},
      },
    } as unknown as AxiosError<RetornoBaseDTO>);

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CONTINUAR}`)!);

    await waitFor(() => {
      expect(screen.getByText(ERRO_RECUPERACAO_SENHA)).toBeInTheDocument();
    });
  });

  it('C06: navega para ROUTES.PRINCIPAL (perfil comum) ou ROUTES.INDICADORES (perfil admin) ao clicar em Voltar', () => {
    const { container, unmount } = renderRedefinirSenha();

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_VOLTAR}`)!);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);

    unmount();
    mockNavigate.mockClear();

    const { container: containerAdmin } = renderRedefinirSenha({
      perfilSelecionado: {
        perfil: TipoPerfil.ADMIN_MEMORIA,
        perfilNome: 'Admin Memória',
      },
    });

    fireEvent.click(containerAdmin.querySelector(`#${CDEP_BUTTON_VOLTAR}`)!);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
  });
});
