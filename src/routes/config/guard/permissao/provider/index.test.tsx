import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PermissaoPorMenuDTO } from '~/core/dto/permissao-por-menu-dto';
import { MenuEnum } from '~/core/enum/menu-enum';
import PermissaoContextProvider, { PermissaoContext } from './';

const ConsumerComponent = () => {
  const { desabilitarCampos, setDesabilitarCampos, permissao } = useContext(PermissaoContext);

  return (
    <div>
      <span data-testid='desabilitar-campos'>{String(desabilitarCampos)}</span>
      <span data-testid='pode-incluir'>{String(permissao.podeIncluir)}</span>
      <span data-testid='pode-alterar'>{String(permissao.podeAlterar)}</span>
      <span data-testid='pode-excluir'>{String(permissao.podeExcluir)}</span>
      <span data-testid='pode-consultar'>{String(permissao.podeConsultar)}</span>
      <span data-testid='custom-roles'>{JSON.stringify(permissao.customRoles ?? [])}</span>
      <button type='button' onClick={() => setDesabilitarCampos((prev) => !prev)}>
        Alternar Desabilitar
      </button>
    </div>
  );
};

const buildMenu = (
  overrides: Partial<PermissaoPorMenuDTO['permissao']> = {},
): PermissaoPorMenuDTO => ({
  key: MenuEnum.Autor,
  exibir: true,
  permissao: {
    podeConsultar: true,
    podeIncluir: true,
    podeAlterar: true,
    podeExcluir: true,
    somenteConsulta: false,
    customRoles: ['ROLE_TESTE'],
    ...overrides,
  },
});

const renderProviderWithRoute = (
  menu: PermissaoPorMenuDTO,
  initialPath: string,
  routePattern: string,
) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path={routePattern}
          element={
            <PermissaoContextProvider menu={menu}>
              <ConsumerComponent />
            </PermissaoContextProvider>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

describe('PermissaoContextProvider', () => {
  test('fornece DEFAULT_VALUES para consumidores fora do PermissaoContextProvider', async () => {
    const user = userEvent.setup();
    render(<ConsumerComponent />);

    expect(screen.getByTestId('desabilitar-campos')).toHaveTextContent('false');
    expect(screen.getByTestId('pode-incluir')).toHaveTextContent('true');
    expect(screen.getByTestId('pode-alterar')).toHaveTextContent('true');
    expect(screen.getByTestId('pode-excluir')).toHaveTextContent('true');
    expect(screen.getByTestId('pode-consultar')).toHaveTextContent('true');
    expect(screen.getByTestId('custom-roles')).toHaveTextContent('[]');

    await user.click(screen.getByRole('button', { name: 'Alternar Desabilitar' }));
    expect(screen.getByTestId('desabilitar-campos')).toHaveTextContent('false');
  });

  test('define desabilitarCampos como true quando somenteConsulta é true mesmo com id e permissões ativas', () => {
    const menu = buildMenu({
      somenteConsulta: true,
      podeAlterar: true,
      podeIncluir: true,
    });

    renderProviderWithRoute(menu, '/cadastro/autor/editar/42', '/cadastro/autor/editar/:id');

    expect(screen.getByTestId('desabilitar-campos')).toHaveTextContent('true');
    expect(screen.getByTestId('custom-roles')).toHaveTextContent('["ROLE_TESTE"]');
  });

  test('define desabilitarCampos como false em rota de edição (:id > 0) quando podeAlterar é true', () => {
    const menu = buildMenu({
      somenteConsulta: false,
      podeAlterar: true,
      podeIncluir: false,
    });

    renderProviderWithRoute(menu, '/cadastro/autor/editar/42', '/cadastro/autor/editar/:id');

    expect(screen.getByTestId('desabilitar-campos')).toHaveTextContent('false');
  });

  test('define desabilitarCampos como true em rota de edição (:id > 0) quando podeAlterar é false mesmo com podeIncluir true', () => {
    const menu = buildMenu({
      somenteConsulta: false,
      podeAlterar: false,
      podeIncluir: true,
    });

    renderProviderWithRoute(menu, '/cadastro/autor/editar/42', '/cadastro/autor/editar/:id');

    expect(screen.getByTestId('desabilitar-campos')).toHaveTextContent('true');
  });

  test('define desabilitarCampos como false em rota sem :id quando podeIncluir é true mesmo com podeAlterar false', () => {
    const menu = buildMenu({
      somenteConsulta: false,
      podeIncluir: true,
      podeAlterar: false,
    });

    renderProviderWithRoute(menu, '/cadastro/autor/novo', '/cadastro/autor/novo');

    expect(screen.getByTestId('desabilitar-campos')).toHaveTextContent('false');
  });

  test('define desabilitarCampos como true em rota sem :id ou com :id igual a 0 quando podeIncluir é false', () => {
    const menu = buildMenu({
      somenteConsulta: false,
      podeIncluir: false,
      podeAlterar: true,
    });

    const { unmount } = renderProviderWithRoute(
      menu,
      '/cadastro/autor/novo',
      '/cadastro/autor/novo',
    );
    expect(screen.getByTestId('desabilitar-campos')).toHaveTextContent('true');
    unmount();

    renderProviderWithRoute(menu, '/cadastro/autor/editar/0', '/cadastro/autor/editar/:id');
    expect(screen.getByTestId('desabilitar-campos')).toHaveTextContent('true');
  });

  test('permite atualização manual de desabilitarCampos via setDesabilitarCampos', async () => {
    const user = userEvent.setup();
    const menuInicial = buildMenu({ somenteConsulta: false, podeIncluir: true });

    renderProviderWithRoute(menuInicial, '/cadastro/autor/novo', '/cadastro/autor/novo');

    expect(screen.getByTestId('desabilitar-campos')).toHaveTextContent('false');

    await user.click(screen.getByRole('button', { name: 'Alternar Desabilitar' }));
    expect(screen.getByTestId('desabilitar-campos')).toHaveTextContent('true');

    await user.click(screen.getByRole('button', { name: 'Alternar Desabilitar' }));
    expect(screen.getByTestId('desabilitar-campos')).toHaveTextContent('false');
  });

  test('recalcula automaticamente desabilitarCampos quando a prop menu é alterada sem interação do usuário', async () => {
    const menuInicial = buildMenu({ somenteConsulta: false, podeIncluir: true });
    const menuRestrito = buildMenu({ somenteConsulta: true, podeIncluir: true });
    const menuLiberadoNovamente = buildMenu({ somenteConsulta: false, podeIncluir: true });

    const { rerender } = render(
      <MemoryRouter initialEntries={['/cadastro/autor/novo']}>
        <Routes>
          <Route
            path='/cadastro/autor/novo'
            element={
              <PermissaoContextProvider menu={menuInicial}>
                <ConsumerComponent />
              </PermissaoContextProvider>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('desabilitar-campos')).toHaveTextContent('false');

    rerender(
      <MemoryRouter initialEntries={['/cadastro/autor/novo']}>
        <Routes>
          <Route
            path='/cadastro/autor/novo'
            element={
              <PermissaoContextProvider menu={menuRestrito}>
                <ConsumerComponent />
              </PermissaoContextProvider>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('desabilitar-campos')).toHaveTextContent('true');
    });

    rerender(
      <MemoryRouter initialEntries={['/cadastro/autor/novo']}>
        <Routes>
          <Route
            path='/cadastro/autor/novo'
            element={
              <PermissaoContextProvider menu={menuLiberadoNovamente}>
                <ConsumerComponent />
              </PermissaoContextProvider>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('desabilitar-campos')).toHaveTextContent('false');
    });
  });
});
