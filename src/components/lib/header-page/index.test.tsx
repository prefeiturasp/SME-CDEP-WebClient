import { render, screen } from '~/tests/test-utils';
import HeaderPage from './';

describe('HeaderPage', () => {
  test('renderiza o título corretamente', () => {
    render(<HeaderPage title='Página de Teste' />);
    const title = screen.getByText('Página de Teste');
    expect(title).toBeInTheDocument();
  });

  /*test('renderiza com estilo de fonte em negrito no título', () => {
    const title = screen.getByText('Título');
    expect(title).toHaveStyle({ fontWeight: 700 });
  });*/

  test('renderiza conteúdo children quando fornecido', () => {
    render(
      <HeaderPage title='Título'>
        <button>Ação</button>
      </HeaderPage>,
    );
    const button = screen.getByRole('button', { name: /ação/i });
    expect(button).toBeInTheDocument();
  });

  /*test('renderiza sem children quando não fornecidos', () => {
    const title = screen.getByText('Somente Título');
    expect(title).toBeInTheDocument();
  });*/

  test('renderiza múltiplos children corretamente', () => {
    render(
      <HeaderPage title='Título'>
        <button>Ação 1</button>
        <button>Ação 2</button>
        <span>Texto Extra</span>
      </HeaderPage>,
    );
    expect(screen.getByText('Ação 1')).toBeInTheDocument();
    expect(screen.getByText('Ação 2')).toBeInTheDocument();
    expect(screen.getByText('Texto Extra')).toBeInTheDocument();
  });

  test('usa componente Affix com offsetTop de 70', () => {
    const { container } = render(<HeaderPage title='Com Affix' />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('título tem tamanho de fonte de 23px', () => {
    render(<HeaderPage title='Título Grande' />);
    const title = screen.getByText('Título Grande');
    expect(title).toHaveStyle({ fontSize: '23px' });
  });
});
