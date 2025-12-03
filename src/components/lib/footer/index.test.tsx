import { render, screen } from '~/tests/test-utils';
import Footer from './';

describe('Footer', () => {
  test('renderiza o componente de rodapé', () => {
    render(<Footer />);
    const footerText = screen.getByText(/sistema homologado para navegadores/i);
    expect(footerText).toBeInTheDocument();
  });

  test('renderiza a logo da Prefeitura de SP', () => {
    render(<Footer />);
    const logo = screen.getByAltText('PREFEITURA SP LOGO');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src');
  });

  test('exibe mensagem sobre navegadores homologados', () => {
    render(<Footer />);
    const mensagem = screen.getByText(
      'Sistema homologado para navegadores: Google Chrome e Firefox',
    );
    expect(mensagem).toBeInTheDocument();
  });

  test('logo possui altura de 45px', () => {
    render(<Footer />);
    const logo = screen.getByAltText('PREFEITURA SP LOGO');
    const styles = window.getComputedStyle(logo);
    expect(styles.height).toBe('45px');
  });

  test('renderiza com posição sticky', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    const styles = window.getComputedStyle(footer as Element);
    expect(styles.position).toBe('sticky');
  });

  test('aplica altura de 49px ao footer', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    const styles = window.getComputedStyle(footer as Element);
    expect(styles.height).toBe('49px');
  });

  test('possui z-index de 1', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    const styles = window.getComputedStyle(footer as Element);
    expect(styles.zIndex).toBe('1');
  });

  test('largura é 100%', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    const styles = window.getComputedStyle(footer as Element);
    expect(styles.width).toBe('100%');
  });

  test('possui borda superior nos itens do footer', () => {
    const { container } = render(<Footer />);
    const footerItems = container.querySelector('.ant-layout-footer > div');
    const styles = window.getComputedStyle(footerItems as Element);
    expect(styles.borderTop).toContain('1px');
  });
});
