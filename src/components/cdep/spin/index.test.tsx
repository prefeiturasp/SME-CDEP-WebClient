import { render, screen } from '~/tests/test-utils';
import Spin from './';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';

const renderWithStore = (spinning: boolean, children: React.ReactNode) => {
  const store = createStore(
    (state = { spin: { spinning } }) => state,
  );

  return render(<Provider store={store}>{children}</Provider>);
};

describe('Spin', () => {
  test('renderiza o conteúdo filho', () => {
    renderWithStore(false, <Spin>Conteúdo de teste</Spin>);
    expect(screen.getByText('Conteúdo de teste')).toBeInTheDocument();
  });

  test('renderiza múltiplos elementos filhos', () => {
    renderWithStore(
      false,
      <Spin>
        <div>Elemento 1</div>
        <div>Elemento 2</div>
      </Spin>,
    );
    expect(screen.getByText('Elemento 1')).toBeInTheDocument();
    expect(screen.getByText('Elemento 2')).toBeInTheDocument();
  });

  test('renderiza texto quando spinning é false', () => {
    renderWithStore(false, <Spin>Não está carregando</Spin>);
    expect(screen.getByText('Não está carregando')).toBeInTheDocument();
  });

  test('renderiza texto quando spinning é true', () => {
    renderWithStore(true, <Spin>Está carregando</Spin>);
    expect(screen.getByText('Está carregando')).toBeInTheDocument();
  });

  test('aceita children como prop', () => {
    const TestComponent = () => <span data-testid="test-component">Test</span>;
    renderWithStore(
      false,
      <Spin>
        <TestComponent />
      </Spin>,
    );
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  test('renderiza componente sem erros quando spinning é true', () => {
    const { container } = renderWithStore(true, <Spin>Carregando</Spin>);
    expect(container).toBeInTheDocument();
  });

  test('renderiza componente sem erros quando spinning é false', () => {
    const { container } = renderWithStore(false, <Spin>Conteúdo</Spin>);
    expect(container).toBeInTheDocument();
  });

  test('aceita elementos HTML como children', () => {
    renderWithStore(
      false,
      <Spin>
        <button>Botão de teste</button>
      </Spin>,
    );
    expect(screen.getByRole('button', { name: /botão de teste/i })).toBeInTheDocument();
  });
});
