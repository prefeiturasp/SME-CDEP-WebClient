import { render, screen } from '~/tests/test-utils';
import BreadcrumbCDEP from './';

jest.mock('~/core/hooks/use-breadcrumb', () => ({
  useBreadcrumb: jest.fn(() => [
    { title: 'Home', href: '/' },
    { title: 'Auto Menu', href: '/auto' },
  ]),
}));

describe('BreadcrumbCDEP', () => {
  test('renderiza breadcrumb com propriedades padrão', () => {
    render(<BreadcrumbCDEP />);
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Nome da Página')).toBeInTheDocument();
  });

  test('renderiza breadcrumb com menu customizado', () => {
    render(<BreadcrumbCDEP menu="Configurações" />);
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  test('renderiza breadcrumb com página principal customizada', () => {
    render(<BreadcrumbCDEP mainPage="Usuários" urlMainPage="/usuarios" />);
    expect(screen.getByText('Usuários')).toBeInTheDocument();
  });

  test('renderiza breadcrumb com título customizado', () => {
    render(<BreadcrumbCDEP title="Novo Usuário" />);
    expect(screen.getByText('Novo Usuário')).toBeInTheDocument();
  });

  test('renderiza breadcrumb automático quando auto=true', () => {
    render(<BreadcrumbCDEP auto={true} />);
    expect(screen.getByText('Auto Menu')).toBeInTheDocument();
  });

  test('renderiza ícones corretamente', () => {
    const { container } = render(<BreadcrumbCDEP />);
    const homeIcon = container.querySelector('img[src="/ic_round-home.svg"]');
    expect(homeIcon).toBeInTheDocument();
  });

  test('renderiza separador corretamente', () => {
    const { container } = render(<BreadcrumbCDEP />);
    const breadcrumb = container.querySelector('.ant-breadcrumb');
    expect(breadcrumb).toBeInTheDocument();
  });

  test('não renderiza título quando não fornecido', () => {
    render(<BreadcrumbCDEP title="" />);
    expect(screen.queryByText('Nome da Página')).not.toBeInTheDocument();
  });
});
