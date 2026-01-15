import { render } from '~/tests/test-utils';
import { HighlightedText } from './';

describe('HighlightedText', () => {
  test('renderiza o texto sem destaque quando searchTerm está vazio', () => {
    const { container } = render(<HighlightedText text='Texto de teste' />);
    expect(container.textContent).toBe('Texto de teste');
  });

  test('destaca palavras quando searchTerm é fornecido', () => {
    const { container } = render(<HighlightedText text='Texto de teste' searchTerm={['teste']} />);
    const highlighted = container.querySelector('mark');
    expect(highlighted).toBeInTheDocument();
    expect(highlighted?.textContent).toBe('teste');
  });

  test('destaca múltiplas palavras', () => {
    const { container } = render(
      <HighlightedText text='Texto de teste completo' searchTerm={['Texto', 'completo']} />,
    );
    const highlighted = container.querySelectorAll('mark');
    expect(highlighted).toHaveLength(2);
  });

  test('ignora diferença de maiúsculas e minúsculas', () => {
    const { container } = render(<HighlightedText text='Texto de TESTE' searchTerm={['teste']} />);
    const highlighted = container.querySelector('mark');
    expect(highlighted).toBeInTheDocument();
  });

  test('funciona com texto acentuado usando latinize', () => {
    const { container } = render(
      <HighlightedText text='Código de açúcar' searchTerm={['acucar']} />,
    );
    expect(container.textContent).toContain('açúcar');
  });

  test('renderiza com array de searchTerms', () => {
    const { container } = render(
      <HighlightedText text='Teste completo 123' searchTerm={['completo', '123']} />,
    );
    const highlighted = container.querySelectorAll('mark');
    expect(highlighted.length).toBeGreaterThan(0);
  });
});
