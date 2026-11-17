import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { PermissaoPorMenuDTO } from '~/core/dto/permissao-por-menu-dto';
import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes';
import rootReducer from '~/core/redux/modules/reducers';
import GuardPermissao from './';
import { PermissaoContext } from './provider';

const createTestStore = (permissaoPorMenu: PermissaoPorMenuDTO[] = []) => {
  const baseState = rootReducer(undefined, { type: '@@INIT' });

  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      ...baseState,
      auth: {
        ...baseState.auth,
        autenticado: true,
      },
      roles: {
        ...baseState.roles,
        permissaoPorMenu,
      },
    },
  });
};

const PaginaProtegidaStub = () => {
  const { desabilitarCampos, permissao } = useContext(PermissaoContext);

  return (
    <div data-testid='pagina-protegida'>
      <span>Conteúdo Autorizado</span>
      <span data-testid='ctx-desabilitar'>{String(desabilitarCampos)}</span>
      <span data-testid='ctx-custom-roles'>{JSON.stringify(permissao.customRoles ?? [])}</span>
    </div>
  );
};

const SemPermissaoStub = () => {
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from;

  return (
    <div data-testid='pagina-sem-permissao'>
      <span>403 Sem Permissão</span>
      {from && <span data-testid='redirect-from'>{from.pathname}</span>}
    </div>
  );
};

describe('GuardPermissao', () => {
  test('renderiza Outlet com PermissaoContextProvider e sem alerta quando exibir=true e somenteConsulta=false', () => {
    const permissaoPorMenu: PermissaoPorMenuDTO[] = [];
    permissaoPorMenu[MenuEnum.Autor] = {
      key: MenuEnum.Autor,
      exibir: true,
      permissao: {
        podeConsultar: true,
        podeIncluir: true,
        podeAlterar: true,
        podeExcluir: true,
        somenteConsulta: false,
        customRoles: ['AUTOR_TOTAL'],
      },
    };

    const store = createTestStore(permissaoPorMenu);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/cadastro/autor']}>
          <Routes>
            <Route path={ROUTES.SEM_PERMISSAO} element={<SemPermissaoStub />} />
            <Route element={<GuardPermissao menuKey={MenuEnum.Autor} />}>
              <Route path='/cadastro/autor' element={<PaginaProtegidaStub />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('pagina-protegida')).toBeInTheDocument();
    expect(screen.getByTestId('ctx-desabilitar')).toHaveTextContent('false');
    expect(screen.getByTestId('ctx-custom-roles')).toHaveTextContent('["AUTOR_TOTAL"]');
    expect(
      screen.queryByText('Você tem apenas permissão de consulta nesta tela.'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('pagina-sem-permissao')).not.toBeInTheDocument();
  });

  test('exibe AlertaSomenteConsulta e desabilita campos no contexto quando somenteConsulta=true', () => {
    const permissaoPorMenu: PermissaoPorMenuDTO[] = [];
    permissaoPorMenu[MenuEnum.Autor] = {
      key: MenuEnum.Autor,
      exibir: true,
      permissao: {
        podeConsultar: true,
        podeIncluir: false,
        podeAlterar: false,
        podeExcluir: false,
        somenteConsulta: true,
        customRoles: ['AUTOR_CONSULTA'],
      },
    };

    const store = createTestStore(permissaoPorMenu);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/cadastro/autor']}>
          <Routes>
            <Route path={ROUTES.SEM_PERMISSAO} element={<SemPermissaoStub />} />
            <Route element={<GuardPermissao menuKey={MenuEnum.Autor} />}>
              <Route path='/cadastro/autor' element={<PaginaProtegidaStub />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Atenção')).toBeInTheDocument();
    expect(
      screen.getByText('Você tem apenas permissão de consulta nesta tela.'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('pagina-protegida')).toBeInTheDocument();
    expect(screen.getByTestId('ctx-desabilitar')).toHaveTextContent('true');
    expect(screen.getByTestId('ctx-custom-roles')).toHaveTextContent('["AUTOR_CONSULTA"]');
  });

  test('redireciona para /sem-permissao preservando location.state.from quando exibir=false', () => {
    const permissaoPorMenu: PermissaoPorMenuDTO[] = [];
    permissaoPorMenu[MenuEnum.Autor] = {
      key: MenuEnum.Autor,
      exibir: false,
      permissao: {
        podeConsultar: false,
        podeIncluir: false,
        podeAlterar: false,
        podeExcluir: false,
        somenteConsulta: false,
      },
    };

    const store = createTestStore(permissaoPorMenu);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/cadastro/autor']}>
          <Routes>
            <Route path={ROUTES.SEM_PERMISSAO} element={<SemPermissaoStub />} />
            <Route element={<GuardPermissao menuKey={MenuEnum.Autor} />}>
              <Route path='/cadastro/autor' element={<PaginaProtegidaStub />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.queryByTestId('pagina-protegida')).not.toBeInTheDocument();
    expect(screen.getByTestId('pagina-sem-permissao')).toBeInTheDocument();
    expect(screen.getByTestId('redirect-from')).toHaveTextContent('/cadastro/autor');
  });

  // Caracterização do comportamento atual (fail-open): ausência de menuKey não bloqueia nem injeta contexto restritivo.
  test('comportamento atual (fallback sem bloqueio): renderiza Outlet diretamente sem PermissaoContextProvider quando menuKey é omitido', () => {
    const store = createTestStore([]);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/cadastro/autor']}>
          <Routes>
            <Route path={ROUTES.SEM_PERMISSAO} element={<SemPermissaoStub />} />
            <Route element={<GuardPermissao />}>
              <Route path='/cadastro/autor' element={<PaginaProtegidaStub />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('pagina-protegida')).toBeInTheDocument();
    expect(screen.getByTestId('ctx-desabilitar')).toHaveTextContent('false');
    expect(screen.getByTestId('ctx-custom-roles')).toHaveTextContent('[]');
    expect(
      screen.queryByText('Você tem apenas permissão de consulta nesta tela.'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('pagina-sem-permissao')).not.toBeInTheDocument();
  });

  // Caracterização do comportamento atual (fail-open): ausência de entrada no mapa permissaoPorMenu não redireciona para /sem-permissao.
  test('comportamento atual (fallback sem bloqueio): renderiza Outlet diretamente quando entrada de menuKey está ausente em permissaoPorMenu', () => {
    const permissaoPorMenu: PermissaoPorMenuDTO[] = [];
    permissaoPorMenu[MenuEnum.Credito] = {
      key: MenuEnum.Credito,
      exibir: false,
      permissao: { podeConsultar: false },
    };

    const store = createTestStore(permissaoPorMenu);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/cadastro/autor']}>
          <Routes>
            <Route path={ROUTES.SEM_PERMISSAO} element={<SemPermissaoStub />} />
            <Route element={<GuardPermissao menuKey={MenuEnum.Autor} />}>
              <Route path='/cadastro/autor' element={<PaginaProtegidaStub />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('pagina-protegida')).toBeInTheDocument();
    expect(screen.getByTestId('ctx-desabilitar')).toHaveTextContent('false');
    expect(screen.getByTestId('ctx-custom-roles')).toHaveTextContent('[]');
    expect(
      screen.queryByText('Você tem apenas permissão de consulta nesta tela.'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('pagina-sem-permissao')).not.toBeInTheDocument();
  });
});
