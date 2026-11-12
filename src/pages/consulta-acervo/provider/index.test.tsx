import React, { useContext } from 'react';
import { render, screen, fireEvent, waitFor } from '~/tests/test-utils';
import ConsultaAcervoContextProvider, { ConsultaAcervoContext } from './index';
import { ROUTES } from '~/core/enum/routes';
import * as acervoService from '~/core/services/acervo-service';

const mockNavigate = jest.fn();
let mockPathname: string = ROUTES.CONSULTA_ACERVO;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname }),
}));

jest.mock('~/core/services/acervo-service', () => ({
  pesquisarAcervosAreaPublica: jest.fn(),
}));

const mockResetFields = jest.fn();

const TestConsumer: React.FC<{
  customCarregarParams?: any;
  customBuscarValues?: any;
}> = ({ customCarregarParams, customBuscarValues }) => {
  const context = useContext(ConsultaAcervoContext);

  return (
    <div>
      <span data-testid='loading'>{String(context.loading)}</span>
      <span data-testid='datasource-length'>{context.dataSource.length}</span>
      <span data-testid='current-page'>{context.listParams.current}</span>
      <span data-testid='page-size'>{context.listParams.pageSize}</span>
      <span data-testid='total-registros'>{context.listParams.total ?? ''}</span>
      <span data-testid='texto-livre'>{context.textoLivrePesquisado || ''}</span>

      <button
        data-testid='btn-carregar'
        onClick={() =>
          context.carregarDados(customCarregarParams || { current: 2, pageSize: 10 }, {
            textoLivre: 'teste',
          })
        }
      >
        Carregar
      </button>

      <button
        data-testid='btn-limpar'
        onClick={() =>
          context.limparDados({
            resetFields: mockResetFields,
          } as any)
        }
      >
        Limpar
      </button>

      <button
        data-testid='btn-buscar'
        onClick={() =>
          context.onClickBuscar({
            validateFields: () =>
              Promise.resolve(customBuscarValues || { textoLivre: 'nova busca' }),
          } as any)
        }
      >
        Buscar
      </button>

      <button
        data-testid='btn-set-datasource'
        onClick={() =>
          context.setDataSource &&
          context.setDataSource([{ acervoId: 1, titulo: 'Livro 1' } as any])
        }
      >
        Set DataSource
      </button>

      <button
        data-testid='btn-set-loading'
        onClick={() => context.setLoading && context.setLoading(true)}
      >
        Set Loading
      </button>
    </div>
  );
};

describe('ConsultaAcervoContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = ROUTES.CONSULTA_ACERVO;
    (acervoService.pesquisarAcervosAreaPublica as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: {
        items: [{ acervoId: 1, titulo: 'Dom Casmurro' }],
        totalRegistros: 1,
      },
    });
  });

  describe('Valores Iniciais', () => {
    test('fornece os valores padrões esperados no contexto', () => {
      render(
        <ConsultaAcervoContextProvider>
          <TestConsumer />
        </ConsultaAcervoContextProvider>,
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('datasource-length')).toHaveTextContent('0');
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
      expect(screen.getByTestId('page-size')).toHaveTextContent('5');
      expect(screen.getByTestId('texto-livre')).toHaveTextContent('');
    });
  });

  describe('carregarDados', () => {
    test('carrega dados com sucesso e atualiza dataSource e paginação', async () => {
      render(
        <ConsultaAcervoContextProvider>
          <TestConsumer />
        </ConsultaAcervoContextProvider>,
      );

      fireEvent.click(screen.getByTestId('btn-carregar'));

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CONSULTA_ACERVO);
      expect(acervoService.pesquisarAcervosAreaPublica).toHaveBeenCalledWith(2, 10, {
        textoLivre: 'teste',
      });

      await waitFor(() => {
        expect(screen.getByTestId('datasource-length')).toHaveTextContent('1');
        expect(screen.getByTestId('total-registros')).toHaveTextContent('1');
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });

    test('utiliza valores padrão de página (1) e registros (5) quando listParams for vazio', async () => {
      render(
        <ConsultaAcervoContextProvider>
          <TestConsumer customCarregarParams={{}} />
        </ConsultaAcervoContextProvider>,
      );

      fireEvent.click(screen.getByTestId('btn-carregar'));

      expect(acervoService.pesquisarAcervosAreaPublica).toHaveBeenCalledWith(1, 5, {
        textoLivre: 'teste',
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });

    test('limpa dataSource quando o serviço retornar sucesso false', async () => {
      (acervoService.pesquisarAcervosAreaPublica as jest.Mock).mockResolvedValue({
        sucesso: false,
      });

      render(
        <ConsultaAcervoContextProvider>
          <TestConsumer />
        </ConsultaAcervoContextProvider>,
      );

      fireEvent.click(screen.getByTestId('btn-carregar'));

      await waitFor(() => {
        expect(screen.getByTestId('datasource-length')).toHaveTextContent('0');
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });
  });

  describe('onClickBuscar', () => {
    test('valida campos, atualiza textoLivrePesquisado e dispara carregarDados na página 1', async () => {
      render(
        <ConsultaAcervoContextProvider>
          <TestConsumer />
        </ConsultaAcervoContextProvider>,
      );

      fireEvent.click(screen.getByTestId('btn-buscar'));

      await waitFor(() => {
        expect(screen.getByTestId('texto-livre')).toHaveTextContent('nova busca');
        expect(acervoService.pesquisarAcervosAreaPublica).toHaveBeenCalledWith(
          1,
          5,
          expect.objectContaining({ textoLivre: 'nova busca' }),
        );
      });
    });
  });

  describe('limparDados', () => {
    test('reseta campos do formulário, dataSource, texto pesquisado e paginação', async () => {
      render(
        <ConsultaAcervoContextProvider>
          <TestConsumer />
        </ConsultaAcervoContextProvider>,
      );

      fireEvent.click(screen.getByTestId('btn-set-datasource'));
      expect(screen.getByTestId('datasource-length')).toHaveTextContent('1');

      fireEvent.click(screen.getByTestId('btn-limpar'));

      expect(mockResetFields).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('datasource-length')).toHaveTextContent('0');
      expect(screen.getByTestId('texto-livre')).toHaveTextContent('');
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    });

    test('navega para CONSULTA_ACERVO se a rota atual for de detalhes e houver dados', () => {
      mockPathname = `${ROUTES.CONSULTA_ACERVO_DETALHES}/1`;

      render(
        <ConsultaAcervoContextProvider>
          <TestConsumer />
        </ConsultaAcervoContextProvider>,
      );

      fireEvent.click(screen.getByTestId('btn-set-datasource'));
      fireEvent.click(screen.getByTestId('btn-limpar'));

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CONSULTA_ACERVO);
    });

    test('não navega se a rota atual não for de detalhes', () => {
      mockPathname = ROUTES.CONSULTA_ACERVO;

      render(
        <ConsultaAcervoContextProvider>
          <TestConsumer />
        </ConsultaAcervoContextProvider>,
      );

      fireEvent.click(screen.getByTestId('btn-set-datasource'));
      fireEvent.click(screen.getByTestId('btn-limpar'));

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Setters e Funções padrões do createContext', () => {
    test('setLoading atualiza o estado', () => {
      render(
        <ConsultaAcervoContextProvider>
          <TestConsumer />
        </ConsultaAcervoContextProvider>,
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      fireEvent.click(screen.getByTestId('btn-set-loading'));
      expect(screen.getByTestId('loading')).toHaveTextContent('true');
    });

    test('executa sem erros os métodos padrões do DEFAULT_VALUES do contexto', () => {
      const DefaultConsumer = () => {
        const ctx = useContext(ConsultaAcervoContext);
        return (
          <button
            data-testid='btn-default-methods'
            onClick={() => {
              ctx.carregarDados({ current: 1 }, { textoLivre: '' });
              ctx.onClickBuscar({} as any);
              ctx.limparDados({} as any);
            }}
          >
            Executar
          </button>
        );
      };

      render(<DefaultConsumer />);
      fireEvent.click(screen.getByTestId('btn-default-methods'));
    });
  });
});
