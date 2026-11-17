import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PermissaoPorMenuDTO } from '~/core/dto/permissao-por-menu-dto';
import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes';
import rootReducer from '~/core/redux/modules/reducers';
import RoutesConfig from './';

jest.mock('~/pages/consulta-acervo', () => {
  const { Outlet } = jest.requireActual('react-router-dom');
  return {
    ConsultaAcervo: () => (
      <div data-testid='layout-consulta-acervo'>
        <Outlet />
      </div>
    ),
  };
});

jest.mock('~/pages/consulta-acervo/lista-cards-consulta-acervo', () => ({
  ListaCardsConsultaAcervo: () => <div data-testid='page-consulta-acervo-lista' />,
}));

jest.mock('~/pages/consulta-acervo/detalhes', () => ({
  DetalhesConsultaAcervo: () => <div data-testid='page-consulta-acervo-detalhes' />,
}));

jest.mock('~/pages/home', () => {
  const { Outlet } = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    default: () => (
      <div data-testid='layout-home'>
        <Outlet />
      </div>
    ),
  };
});

jest.mock('~/pages/principal/index', () => {
  const { Outlet } = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    default: () => (
      <div data-testid='layout-principal'>
        <Outlet />
      </div>
    ),
  };
});

jest.mock('~/pages/login', () => ({
  __esModule: true,
  default: () => <div data-testid='page-login' />,
}));
jest.mock('~/pages/criar-conta', () => ({
  __esModule: true,
  default: () => <div data-testid='page-criar-conta' />,
}));
jest.mock('~/pages/redefinir-senha', () => ({
  __esModule: true,
  default: () => <div data-testid='page-redefinir-senha' />,
}));
jest.mock('~/pages/redefinir-senha-token', () => ({
  __esModule: true,
  default: () => <div data-testid='page-redefinir-senha-token' />,
}));
jest.mock('~/pages/inicial', () => ({
  __esModule: true,
  default: () => <div data-testid='page-inicial' />,
}));
jest.mock('~/pages/meus-dados', () => ({
  __esModule: true,
  default: () => <div data-testid='page-meus-dados' />,
}));
jest.mock('~/pages/403', () => ({
  __esModule: true,
  default: () => <div data-testid='page-403' />,
}));
jest.mock('~/pages/404', () => ({
  __esModule: true,
  default: () => <div data-testid='page-404' />,
}));

jest.mock('~/components/cdep/cadastros/auxiliares/form/form-config', () => ({
  __esModule: true,
  default: () => <div data-testid='page-form-auxiliar' />,
}));
jest.mock('~/pages/cadastros/credito', () => ({
  __esModule: true,
  default: () => <div data-testid='page-credito' />,
}));
jest.mock('~/pages/cadastros/autor', () => ({
  __esModule: true,
  default: () => <div data-testid='page-autor' />,
}));
jest.mock('~/pages/cadastros/editora', () => ({
  __esModule: true,
  default: () => <div data-testid='page-editora' />,
}));
jest.mock('~/pages/cadastros/assunto', () => ({
  __esModule: true,
  default: () => <div data-testid='page-assunto' />,
}));
jest.mock('~/pages/cadastros/serie-colecao', () => ({
  __esModule: true,
  default: () => <div data-testid='page-serie-colecao' />,
}));

jest.mock('~/pages/cadastros/acervo/list', () => ({
  __esModule: true,
  default: () => <div data-testid='page-acervo-list' />,
}));
jest.mock('~/pages/cadastros/acervo/form', () => ({
  __esModule: true,
  default: () => <div data-testid='page-acervo-form' />,
}));
jest.mock('~/pages/cadastros/acervo/importar-acervo', () => ({
  __esModule: true,
  default: () => <div data-testid='page-acervo-importar' />,
}));

jest.mock('~/pages/operacoes/solicitacao', () => ({
  __esModule: true,
  default: () => <div data-testid='page-solicitacao' />,
}));
jest.mock('~/pages/operacoes/atendimento-solicitacoes/list', () => ({
  ListAtendimentoSolicitacoes: () => <div data-testid='page-atendimento-list' />,
}));
jest.mock('~/pages/operacoes/atendimento-solicitacoes/form', () => ({
  FormAtendimentoSolicitacoes: () => <div data-testid='page-atendimento-form' />,
}));
jest.mock('~/pages/operacoes/atendimento-solicitacoes/solicitacao-manual', () => ({
  SolicitacaoManual: () => <div data-testid='page-solicitacao-manual' />,
}));

jest.mock('~/pages/gestao/calendario', () => ({
  Calendario: () => <div data-testid='page-calendario' />,
}));

jest.mock('~/pages/relatorios/livros-emprestados', () => ({
  __esModule: true,
  default: () => <div data-testid='page-relatorio-livros-emprestados' />,
}));
jest.mock('~/pages/relatorios/tombo-codigo', () => ({
  __esModule: true,
  default: () => <div data-testid='page-relatorio-tombo-codigo' />,
}));
jest.mock('~/pages/relatorios/autor-credito', () => ({
  __esModule: true,
  default: () => <div data-testid='page-relatorio-autor-credito' />,
}));
jest.mock('~/pages/relatorios/editora', () => ({
  __esModule: true,
  default: () => <div data-testid='page-relatorio-editora' />,
}));
jest.mock('~/pages/relatorios/devolucao-livros', () => ({
  __esModule: true,
  default: () => <div data-testid='page-relatorio-devolucao-livros' />,
}));
jest.mock('~/pages/relatorios/download-acervos', () => ({
  __esModule: true,
  default: () => <div data-testid='page-relatorio-download-acervos' />,
}));
jest.mock('~/pages/relatorios/titulos-mais-pesquisados', () => ({
  __esModule: true,
  default: () => <div data-testid='page-relatorio-titulos-mais-pesquisados' />,
}));
jest.mock('~/pages/relatorios/historico-solicitacoes', () => ({
  __esModule: true,
  default: () => <div data-testid='page-relatorio-historico-solicitacoes' />,
}));
jest.mock('~/pages/indicadores', () => ({
  __esModule: true,
  default: () => <div data-testid='page-indicadores' />,
}));

const buildPermissoes = (
  configureMenu: (menu: MenuEnum) => { exibir: boolean; somenteConsulta?: boolean },
): PermissaoPorMenuDTO[] => {
  const permissoes: PermissaoPorMenuDTO[] = [];
  Object.values(MenuEnum).forEach((value) => {
    if (typeof value === 'number') {
      const { exibir, somenteConsulta = false } = configureMenu(value);
      permissoes[value] = {
        key: value,
        exibir,
        permissao: {
          podeConsultar: exibir,
          podeIncluir: exibir && !somenteConsulta,
          podeAlterar: exibir && !somenteConsulta,
          podeExcluir: exibir && !somenteConsulta,
          somenteConsulta,
        },
      };
    }
  });
  return permissoes;
};

const renderRoutesAt = (
  path: string,
  autenticado: boolean,
  configureMenu: (menu: MenuEnum) => { exibir: boolean; somenteConsulta?: boolean } = () => ({
    exibir: true,
  }),
) => {
  window.history.pushState({}, '', path);
  const baseState = rootReducer(undefined, { type: '@@INIT' });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      ...baseState,
      auth: {
        ...baseState.auth,
        autenticado,
        token: autenticado ? 'token-ativo' : '',
      },
      roles: {
        ...baseState.roles,
        permissaoPorMenu: autenticado ? buildPermissoes(configureMenu) : [],
      },
    },
  });

  return render(
    <Provider store={store}>
      <RoutesConfig />
    </Provider>,
  );
};

describe('RoutesConfig', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  describe('Rotas públicas (Consulta de Acervo)', () => {
    test.each([
      [ROUTES.CONSULTA_ACERVO, 'page-consulta-acervo-lista', false],
      [ROUTES.CONSULTA_ACERVO_DETALHES, 'page-consulta-acervo-detalhes', false],
      [ROUTES.CONSULTA_ACERVO, 'page-consulta-acervo-lista', true],
      [ROUTES.CONSULTA_ACERVO_DETALHES, 'page-consulta-acervo-detalhes', true],
    ])('renderiza %s (autenticado=%s) sem redirecionar', (path, testId, autenticado) => {
      renderRoutesAt(path, autenticado);

      expect(window.location.pathname).toBe(path);
      expect(screen.getByTestId('layout-consulta-acervo')).toBeInTheDocument();
      expect(screen.getByTestId(testId)).toBeInTheDocument();
      expect(screen.queryByTestId('page-login')).not.toBeInTheDocument();
    });
  });

  describe('Usuário não autenticado', () => {
    test.each([
      [ROUTES.LOGIN, 'page-login'],
      [ROUTES.CRIAR_CONTA, 'page-criar-conta'],
      [ROUTES.REDEFINIR_SENHA, 'page-redefinir-senha'],
      ['/redefinir-senha/token-valido-123', 'page-redefinir-senha-token'],
    ])('renderiza rota pública %s dentro do layout Home', (path, testId) => {
      renderRoutesAt(path, false);

      expect(window.location.pathname).toBe(path);
      expect(screen.getByTestId('layout-home')).toBeInTheDocument();
      expect(screen.getByTestId(testId)).toBeInTheDocument();
      expect(screen.queryByTestId('layout-principal')).not.toBeInTheDocument();
    });

    test.each([
      ROUTES.PRINCIPAL,
      ROUTES.MEUS_DADOS,
      ROUTES.ACERVO,
      ROUTES.SOLICITACAO,
      '/rota-inexistente',
    ])('redireciona %s para /login quando não autenticado', (path) => {
      renderRoutesAt(path, false);

      expect(window.location.pathname).toBe(ROUTES.LOGIN);
      expect(screen.getByTestId('layout-home')).toBeInTheDocument();
      expect(screen.getByTestId('page-login')).toBeInTheDocument();
      expect(screen.queryByTestId('layout-principal')).not.toBeInTheDocument();
    });
  });

  describe('Usuário autenticado — rotas base e redirecionamentos', () => {
    test('renderiza Inicial na rota raiz /', () => {
      renderRoutesAt(ROUTES.PRINCIPAL, true);

      expect(window.location.pathname).toBe(ROUTES.PRINCIPAL);
      expect(screen.getByTestId('layout-principal')).toBeInTheDocument();
      expect(screen.getByTestId('page-inicial')).toBeInTheDocument();
    });

    test('renderiza MeusDados em /meus-dados e PageForbidden em /sem-permissao', () => {
      const { unmount } = renderRoutesAt(ROUTES.MEUS_DADOS, true);
      expect(window.location.pathname).toBe(ROUTES.MEUS_DADOS);
      expect(screen.getByTestId('layout-principal')).toBeInTheDocument();
      expect(screen.getByTestId('page-meus-dados')).toBeInTheDocument();
      unmount();

      renderRoutesAt(ROUTES.SEM_PERMISSAO, true);
      expect(window.location.pathname).toBe(ROUTES.SEM_PERMISSAO);
      expect(screen.getByTestId('layout-principal')).toBeInTheDocument();
      expect(screen.getByTestId('page-403')).toBeInTheDocument();
    });

    test('redireciona /login para / quando já autenticado', () => {
      renderRoutesAt(ROUTES.LOGIN, true);

      expect(window.location.pathname).toBe(ROUTES.PRINCIPAL);
      expect(screen.getByTestId('page-inicial')).toBeInTheDocument();
      expect(screen.queryByTestId('page-login')).not.toBeInTheDocument();
    });

    test('renderiza PageNotFound (404) para rota desconhecida quando autenticado', () => {
      renderRoutesAt('/caminho-que-nao-existe', true);

      expect(window.location.pathname).toBe('/caminho-que-nao-existe');
      expect(screen.getByTestId('layout-principal')).toBeInTheDocument();
      expect(screen.getByTestId('page-404')).toBeInTheDocument();
    });
  });

  describe('Usuário autenticado — integração real com GuardPermissao por MenuEnum específico', () => {
    test.each<[string, MenuEnum, string]>([
      [ROUTES.CREDITO, MenuEnum.Credito, 'page-credito'],
      [ROUTES.CREDITO_NOVO, MenuEnum.Credito, 'page-form-auxiliar'],
      ['/cadastro/credito/editar/10', MenuEnum.Credito, 'page-form-auxiliar'],
      [ROUTES.AUTOR, MenuEnum.Autor, 'page-autor'],
      [ROUTES.AUTOR_NOVO, MenuEnum.Autor, 'page-form-auxiliar'],
      ['/cadastro/autor/editar/5', MenuEnum.Autor, 'page-form-auxiliar'],
      [ROUTES.EDITORA, MenuEnum.Editora, 'page-editora'],
      [ROUTES.ASSUNTO, MenuEnum.Assunto, 'page-assunto'],
      [ROUTES.SERIE_COLECAO, MenuEnum.SerieColecao, 'page-serie-colecao'],
      [ROUTES.ACERVO, MenuEnum.Acervo, 'page-acervo-list'],
      [ROUTES.ACERVO_NOVO, MenuEnum.Acervo, 'page-acervo-form'],
      ['/cadastro/acervo/editar/99', MenuEnum.Acervo, 'page-acervo-form'],
      [ROUTES.ACERVO_IMPORTAR, MenuEnum.Acervo, 'page-acervo-importar'],
      [ROUTES.SOLICITACAO, MenuEnum.Solicitacao, 'page-solicitacao'],
      ['/acervo/solicitacao/12', MenuEnum.Solicitacao, 'page-solicitacao'],
      [ROUTES.ATENDIMENTO_SOLICITACOES, MenuEnum.AtendimentoSolicitacoes, 'page-atendimento-list'],
      [
        '/acervo/atendimento-solicitacoes/7',
        MenuEnum.AtendimentoSolicitacoes,
        'page-atendimento-form',
      ],
      [
        ROUTES.ATENDIMENTO_SOLICITACAO_MANUAL,
        MenuEnum.AtendimentoSolicitacoes,
        'page-solicitacao-manual',
      ],
      [ROUTES.CALENDARIO, MenuEnum.Calendario, 'page-calendario'],
      [ROUTES.LIVROS_EMPRESTADOS, MenuEnum.LivrosEmprestados, 'page-relatorio-livros-emprestados'],
      [ROUTES.TOMBO_CODIGO, MenuEnum.TomboCodigo, 'page-relatorio-tombo-codigo'],
      [ROUTES.AUTOR_CREDITO, MenuEnum.AutorCredito, 'page-relatorio-autor-credito'],
      [ROUTES.RELATORIO_EDITORA, MenuEnum.RelatorioEditora, 'page-relatorio-editora'],
      [
        ROUTES.RELATORIO_DEVOLUCAO_LIVRO,
        MenuEnum.RelatorioDevolucaoLivro,
        'page-relatorio-devolucao-livros',
      ],
      [
        ROUTES.RELATORIO_DOWNLOAD_ACERVOS,
        MenuEnum.RelatorioDownloadAcervos,
        'page-relatorio-download-acervos',
      ],
      [
        ROUTES.TITULOS_MAIS_PESQUISADOS,
        MenuEnum.TitulosMaisPesquisados,
        'page-relatorio-titulos-mais-pesquisados',
      ],
      [
        ROUTES.HISTORICO_SOLICITACOES,
        MenuEnum.HistoricoSolicitacoes,
        'page-relatorio-historico-solicitacoes',
      ],
      [ROUTES.INDICADORES, MenuEnum.Indicadores, 'page-indicadores'],
    ])(
      'renderiza %s apenas quando o MenuEnum correspondente (%s) está autorizado',
      (path, expectedMenu, expectedTestId) => {
        renderRoutesAt(path, true, (menu) => ({ exibir: menu === expectedMenu }));

        expect(window.location.pathname).toBe(path);
        expect(screen.getByTestId('layout-principal')).toBeInTheDocument();
        expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
        expect(screen.queryByTestId('page-403')).not.toBeInTheDocument();
      },
    );

    test.each<[string, MenuEnum, string]>([
      [ROUTES.CREDITO, MenuEnum.Credito, 'page-credito'],
      [ROUTES.AUTOR, MenuEnum.Autor, 'page-autor'],
      [ROUTES.EDITORA, MenuEnum.Editora, 'page-editora'],
      [ROUTES.ASSUNTO, MenuEnum.Assunto, 'page-assunto'],
      [ROUTES.SERIE_COLECAO, MenuEnum.SerieColecao, 'page-serie-colecao'],
      [ROUTES.ACERVO, MenuEnum.Acervo, 'page-acervo-list'],
      [ROUTES.SOLICITACAO, MenuEnum.Solicitacao, 'page-solicitacao'],
      [ROUTES.ATENDIMENTO_SOLICITACOES, MenuEnum.AtendimentoSolicitacoes, 'page-atendimento-list'],
      [ROUTES.CALENDARIO, MenuEnum.Calendario, 'page-calendario'],
      [ROUTES.LIVROS_EMPRESTADOS, MenuEnum.LivrosEmprestados, 'page-relatorio-livros-emprestados'],
      [ROUTES.INDICADORES, MenuEnum.Indicadores, 'page-indicadores'],
    ])(
      'redireciona %s para /sem-permissao quando apenas o MenuEnum %s tem exibir=false',
      (path, deniedMenu, blockedTestId) => {
        renderRoutesAt(path, true, (menu) => ({ exibir: menu !== deniedMenu }));

        expect(window.location.pathname).toBe(ROUTES.SEM_PERMISSAO);
        expect(screen.getByTestId('page-403')).toBeInTheDocument();
        expect(screen.queryByTestId(blockedTestId)).not.toBeInTheDocument();
      },
    );

    test('propaga AlertaSomenteConsulta via GuardPermissao real ao acessar rota com somenteConsulta=true', () => {
      renderRoutesAt(ROUTES.AUTOR, true, (menu) => ({
        exibir: menu === MenuEnum.Autor,
        somenteConsulta: menu === MenuEnum.Autor,
      }));

      expect(window.location.pathname).toBe(ROUTES.AUTOR);
      expect(screen.getByTestId('page-autor')).toBeInTheDocument();
      expect(
        screen.getByText('Você tem apenas permissão de consulta nesta tela.'),
      ).toBeInTheDocument();
    });
  });
});
