import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ROUTES } from '~/core/enum/routes';
import { setDeslogar } from '~/core/redux/modules/auth/actions';
import rootReducer from '~/core/redux/modules/reducers';
import GuardAutenticacao from './';

const createTestStore = (autenticado: boolean) => {
  const baseState = rootReducer(undefined, { type: '@@INIT' });

  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      ...baseState,
      auth: {
        ...baseState.auth,
        autenticado,
        token: autenticado ? 'token-valido' : '',
      },
    },
  });
};

const LoginStub = () => {
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string; search: string } } | null)?.from;

  return (
    <div data-testid='pagina-login'>
      <span>Tela de Login</span>
      <span data-testid='login-pathname'>{location.pathname}</span>
      {from && (
        <span data-testid='redirect-from'>
          {from.pathname}
          {from.search}
        </span>
      )}
    </div>
  );
};

describe('GuardAutenticacao', () => {
  test('redireciona para /login preservando location.state.from quando usuário não está autenticado', () => {
    const store = createTestStore(false);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/cadastro/autor?pagina=2']}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginStub />} />
            <Route element={<GuardAutenticacao />}>
              <Route
                path='/cadastro/autor'
                element={<div data-testid='conteudo-protegido'>Conteúdo Protegido</div>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.queryByTestId('conteudo-protegido')).not.toBeInTheDocument();
    expect(screen.getByTestId('pagina-login')).toBeInTheDocument();
    expect(screen.getByTestId('login-pathname')).toHaveTextContent(ROUTES.LOGIN);
    expect(screen.getByTestId('redirect-from')).toHaveTextContent('/cadastro/autor?pagina=2');
  });

  test('renderiza o Outlet com o conteúdo protegido quando usuário está autenticado', () => {
    const store = createTestStore(true);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/cadastro/autor']}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginStub />} />
            <Route element={<GuardAutenticacao />}>
              <Route
                path='/cadastro/autor'
                element={<div data-testid='conteudo-protegido'>Conteúdo Protegido</div>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('conteudo-protegido')).toBeInTheDocument();
    expect(screen.queryByTestId('pagina-login')).not.toBeInTheDocument();
  });

  test('redireciona imediatamente para /login ao perder autenticação na store Redux', () => {
    const store = createTestStore(true);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/acervo/solicitacao']}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginStub />} />
            <Route element={<GuardAutenticacao />}>
              <Route
                path='/acervo/solicitacao'
                element={<div data-testid='conteudo-protegido'>Solicitação</div>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('conteudo-protegido')).toBeInTheDocument();

    act(() => {
      store.dispatch(setDeslogar());
    });

    expect(screen.queryByTestId('conteudo-protegido')).not.toBeInTheDocument();
    expect(screen.getByTestId('pagina-login')).toBeInTheDocument();
    expect(screen.getByTestId('login-pathname')).toHaveTextContent(ROUTES.LOGIN);
    expect(screen.getByTestId('redirect-from')).toHaveTextContent('/acervo/solicitacao');
  });
});
