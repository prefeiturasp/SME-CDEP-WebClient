import { act, render, renderHook, screen } from '@testing-library/react';
import { useContext } from 'react';
import { AcervoSolicitacaoItemRetornoCadastroDTO } from '~/core/dto/acervo-solicitacao-item-retorno-cadastro-dto';
import AcervoSolicitacaoContextProvider, { AcervoSolicitacaoContext } from './index';

describe('AcervoSolicitacaoContext e AcervoSolicitacaoContextProvider', () => {
  it('deve fornecer os valores padrão quando usado fora do Provider', () => {
    const TestConsumer = () => {
      const context = useContext(AcervoSolicitacaoContext);

      return (
        <div>
          <span data-testid='data-source-length'>{context.dataSource.length}</span>
          <span data-testid='pode-cancelar'>{String(context.podeCancelarSolicitacao)}</span>
          <button
            data-testid='btn-default-set-data-source'
            onClick={() => context.setDataSource([])}
          >
            Set Data Source
          </button>
          <button
            data-testid='btn-default-set-pode-cancelar'
            onClick={() => context.setPodeCancelarSolicitacao(true)}
          >
            Set Pode Cancelar
          </button>
        </div>
      );
    };

    render(<TestConsumer />);

    expect(screen.getByTestId('data-source-length')).toHaveTextContent('0');
    expect(screen.getByTestId('pode-cancelar')).toHaveTextContent('false');

    // Executa as funções vazias padrão para cobrir 100% das funções do DEFAULT_VALUES
    act(() => {
      screen.getByTestId('btn-default-set-data-source').click();
      screen.getByTestId('btn-default-set-pode-cancelar').click();
    });
  });

  it('deve inicializar o contexto com valores padrão dentro do Provider', () => {
    const { result } = renderHook(() => useContext(AcervoSolicitacaoContext), {
      wrapper: AcervoSolicitacaoContextProvider,
    });

    expect(result.current.dataSource).toEqual([]);
    expect(result.current.podeCancelarSolicitacao).toBe(false);
  });

  it('deve atualizar dataSource quando setDataSource for chamado', () => {
    const { result } = renderHook(() => useContext(AcervoSolicitacaoContext), {
      wrapper: AcervoSolicitacaoContextProvider,
    });

    const mockItem: AcervoSolicitacaoItemRetornoCadastroDTO = {
      id: 1,
      acervoId: 10,
      titulo: 'Livro Teste',
    } as AcervoSolicitacaoItemRetornoCadastroDTO;

    act(() => {
      result.current.setDataSource([mockItem]);
    });

    expect(result.current.dataSource).toEqual([mockItem]);
    expect(result.current.dataSource).toHaveLength(1);
    expect(result.current.dataSource[0].titulo).toBe('Livro Teste');
  });

  it('deve atualizar podeCancelarSolicitacao quando setPodeCancelarSolicitacao for chamado', () => {
    const { result } = renderHook(() => useContext(AcervoSolicitacaoContext), {
      wrapper: AcervoSolicitacaoContextProvider,
    });

    act(() => {
      result.current.setPodeCancelarSolicitacao(true);
    });

    expect(result.current.podeCancelarSolicitacao).toBe(true);

    act(() => {
      result.current.setPodeCancelarSolicitacao(false);
    });

    expect(result.current.podeCancelarSolicitacao).toBe(false);
  });

  it('deve renderizar os componentes filhos (children) corretamente', () => {
    render(
      <AcervoSolicitacaoContextProvider>
        <div data-testid='filho-teste'>Filho Renderizado</div>
      </AcervoSolicitacaoContextProvider>,
    );

    expect(screen.getByTestId('filho-teste')).toBeInTheDocument();
    expect(screen.getByText('Filho Renderizado')).toBeInTheDocument();
  });
});
