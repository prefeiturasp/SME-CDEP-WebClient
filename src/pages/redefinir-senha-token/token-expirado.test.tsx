import { AnyAction, configureStore, Reducer } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { PerfilUsuarioDTO } from '~/core/dto/perfil-usuario-dto';
import { ROUTES } from '~/core/enum/routes';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';
import perfilReducer from '~/core/redux/modules/perfil/reducers';
import TokenExpirado from './token-expirado';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderTokenExpirado = (perfilSelecionado?: PerfilUsuarioDTO) => {
  const store = configureStore({
    reducer: {
      perfil: perfilReducer as unknown as Reducer<
        { perfilUsuario: PerfilUsuarioDTO[]; perfilSelecionado?: PerfilUsuarioDTO },
        AnyAction
      >,
    },
    preloadedState: {
      perfil: {
        perfilUsuario: perfilSelecionado ? [perfilSelecionado] : [],
        perfilSelecionado,
      },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <TokenExpirado />
      </MemoryRouter>
    </Provider>,
  );
};

describe('Componente TokenExpirado (src/pages/redefinir-senha-token/token-expirado.tsx)', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('C14: renderiza o título, a mensagem de link expirado e o botão Voltar', () => {
    const { container } = renderTokenExpirado();

    expect(screen.getByText('Redefinição de Senha')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Este link expirou, utilize a opção "Esqueci minha senha" para solicitar um novo link.',
      ),
    ).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_BUTTON_VOLTAR}`)).toBeInTheDocument();
  });

  it('C15: redireciona para ROUTES.PRINCIPAL ao clicar em Voltar quando não há perfil ou o perfil não é admin', () => {
    const { container, unmount } = renderTokenExpirado();

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_VOLTAR}`)!);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);

    unmount();
    mockNavigate.mockClear();

    const { container: containerBasico } = renderTokenExpirado({
      perfil: TipoPerfil.BASICO,
      perfilNome: 'Básico',
    });

    fireEvent.click(containerBasico.querySelector(`#${CDEP_BUTTON_VOLTAR}`)!);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
  });

  it('C16: redireciona para ROUTES.INDICADORES ao clicar em Voltar quando o perfil selecionado é administrativo', () => {
    const { container } = renderTokenExpirado({
      perfil: TipoPerfil.ADMIN_GERAL,
      perfilNome: 'Admin Geral',
    });

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_VOLTAR}`)!);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
  });
});
