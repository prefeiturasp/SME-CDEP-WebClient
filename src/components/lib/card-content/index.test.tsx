import { render, screen } from '~/tests/test-utils';
import CardContent from './';

describe('CardContent', () => {
  test('renderiza o conteúdo filho', () => {
    render(
      <CardContent>
        <div>Conteúdo de teste</div>
      </CardContent>,
    );
    expect(screen.getByText('Conteúdo de teste')).toBeInTheDocument();
  });

  test('renderiza múltiplos elementos filhos', () => {
    render(
      <CardContent>
        <h1>Título</h1>
        <p>Parágrafo</p>
        <button>Botão</button>
      </CardContent>,
    );
    expect(screen.getByRole('heading', { name: /título/i })).toBeInTheDocument();
    expect(screen.getByText('Parágrafo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /botão/i })).toBeInTheDocument();
  });

  test('aplica estilos de container corretamente', () => {
    const { container } = render(
      <CardContent>
        <div>Teste</div>
      </CardContent>,
    );
    const cardContainer = container.firstChild as HTMLElement;
    const styles = window.getComputedStyle(cardContainer);

    expect(styles.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(styles.borderRadius).toBe('4px');
    expect(styles.padding).toBe('24px');
  });

  test('renderiza com altura de 100%', () => {
    const { container } = render(
      <CardContent>
        <div>Teste</div>
      </CardContent>,
    );
    const cardContainer = container.firstChild as HTMLElement;
    const styles = window.getComputedStyle(cardContainer);

    expect(styles.height).toBe('100%');
  });

  test('renderiza componentes React como filhos', () => {
    const ComponenteTeste = () => <span>Componente customizado</span>;
    render(
      <CardContent>
        <ComponenteTeste />
      </CardContent>,
    );
    expect(screen.getByText('Componente customizado')).toBeInTheDocument();
  });

  test('renderiza texto simples como filho', () => {
    render(<CardContent>Texto simples</CardContent>);
    expect(screen.getByText('Texto simples')).toBeInTheDocument();
  });

  test('renderiza sem erros quando não há filhos', () => {
    const { container } = render(<CardContent />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
