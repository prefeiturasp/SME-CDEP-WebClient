import { AnyAction, configureStore, Reducer } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { PerfilUsuarioDTO } from '~/core/dto/perfil-usuario-dto';
import { ROUTES } from '~/core/enum/routes';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';
import perfilReducer from '~/core/redux/modules/perfil/reducers';
import EnviarSolicitacoes from './index';

const mockNavigate = jest.fn();
const mockUseParams = jest.fn(() => ({} as { id?: string }));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

jest.mock('./components/card-dados-solicitante', () => ({
  __esModule: true,
  default: () => <div data-testid='mock-card-dados-solicitante'>CardDadosSolicitante</div>,
}));

jest.mock('./components/lista-acervos-solicitacao', () => ({
  __esModule: true,
  default: () => <div data-testid='mock-lista-acervos'>ListaAcervosSolicitacao</div>,
}));

jest.mock('./components/btn-cancelar-solicitacao', () => ({
  __esModule: true,
  default: () => <button data-testid='mock-btn-cancelar'>Cancelar solicitação</button>,
}));

jest.mock('./components/btn-enviar-solicitacao', () => ({
  __esModule: true,
  default: () => <button data-testid='mock-btn-enviar'>Enviar solicitação</button>,
}));

type PerfilStorageState = {
  perfis: PerfilUsuarioDTO[];
  perfilSelecionado: PerfilUsuarioDTO | null;
};

const renderPage = (perfilOverride?: Partial<PerfilStorageState>) => {
  const store = configureStore({
    reducer: {
      perfil: perfilReducer as unknown as Reducer<PerfilStorageState, AnyAction>,
    },
    preloadedState: {
      perfil: {
        perfis: [],
        perfilSelecionado: null,
        ...perfilOverride,
      },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <EnviarSolicitacoes />
      </MemoryRouter>
    </Provider>,
  );
};

describe('EnviarSolicitacoes Page (src/pages/operacoes/solicitacao/index.tsx)', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseParams.mockReturnValue({});
  });

  it('C17: deve exibir título "Nova Solicitação" quando não houver id na rota e renderizar subcomponentes', () => {
    renderPage();

    expect(screen.getByText('Nova Solicitação')).toBeInTheDocument();
    expect(screen.getByTestId('mock-card-dados-solicitante')).toBeInTheDocument();
    expect(screen.getByTestId('mock-lista-acervos')).toBeInTheDocument();
    expect(screen.getByTestId('mock-btn-cancelar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-btn-enviar')).toBeInTheDocument();
  });

  it('C18: deve exibir título "Solicitação - Nº42" quando houver id na rota', () => {
    mockUseParams.mockReturnValue({ id: '42' });

    renderPage();

    expect(screen.getByText('Solicitação - Nº42')).toBeInTheDocument();
  });

  it('C19: deve navegar para ROUTES.PRINCIPAL quando perfil comum clicar em Voltar e para ROUTES.INDICADORES quando perfil admin clicar em Voltar', () => {
    const { container, unmount } = renderPage({
      perfilSelecionado: {
        perfil: TipoPerfil.EXTERNO,
        perfilNome: 'Externo',
      },
    });

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_VOLTAR}`) as HTMLButtonElement);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);

    unmount();
    mockNavigate.mockReset();

    const { container: containerAdmin } = renderPage({
      perfilSelecionado: {
        perfil: TipoPerfil.ADMIN_GERAL,
        perfilNome: 'Admin Geral',
      },
    });

    fireEvent.click(containerAdmin.querySelector(`#${CDEP_BUTTON_VOLTAR}`) as HTMLButtonElement);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
  });
});
