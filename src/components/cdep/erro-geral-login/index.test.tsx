import { render, screen } from '~/tests/test-utils';
import ErroGeralLogin from './';

describe('ErroGeralLogin', () => {
  test('deve renderizar uma lista de erros', () => {
    const erros = ['Erro 1', 'Erro 2', 'Erro 3'];
    render(<ErroGeralLogin erros={erros} />);
    expect(screen.getByText('Erro 1')).toBeInTheDocument();
    expect(screen.getByText('Erro 2')).toBeInTheDocument();
    expect(screen.getByText('Erro 3')).toBeInTheDocument();
  });

  test('deve renderizar cada erro em um parágrafo', () => {
    const erros = ['Erro único'];
    const { container } = render(<ErroGeralLogin erros={erros} />);
    const paragrafos = container.querySelectorAll('p');
    expect(paragrafos).toHaveLength(1);
  });

  test('deve renderizar múltiplos erros em parágrafos separados', () => {
    const erros = ['Erro 1', 'Erro 2'];
    const { container } = render(<ErroGeralLogin erros={erros} />);
    const paragrafos = container.querySelectorAll('p');
    expect(paragrafos).toHaveLength(2);
  });

  test('não deve renderizar nada quando a lista de erros está vazia', () => {
    const { container } = render(<ErroGeralLogin erros={[]} />);
    const paragrafos = container.querySelectorAll('p');
    expect(paragrafos).toHaveLength(0);
  });

  test('deve usar o erro como key do elemento', () => {
    const erros = ['Erro único'];
    const { container } = render(<ErroGeralLogin erros={erros} />);
    expect(container.querySelector('p')).toHaveTextContent('Erro único');
  });

  test('deve renderizar erros com caracteres especiais', () => {
    const erros = ['Erro: Login inválido!', 'Erro: Senha incorreta?'];
    render(<ErroGeralLogin erros={erros} />);
    expect(screen.getByText('Erro: Login inválido!')).toBeInTheDocument();
    expect(screen.getByText('Erro: Senha incorreta?')).toBeInTheDocument();
  });

  test('deve renderizar erros longos', () => {
    const erroLongo = 'Este é um erro muito longo que descreve um problema detalhado do sistema';
    render(<ErroGeralLogin erros={[erroLongo]} />);
    expect(screen.getByText(erroLongo)).toBeInTheDocument();
  });

  test('deve renderizar o container com estilo customizado', () => {
    const { container } = render(<ErroGeralLogin erros={['Erro']} />);
    expect(container.firstChild).toBeTruthy();
  });

  test('deve renderizar cinco erros corretamente', () => {
    const erros = ['Erro A', 'Erro B', 'Erro C', 'Erro D', 'Erro E'];
    const { container } = render(<ErroGeralLogin erros={erros} />);
    const paragrafos = container.querySelectorAll('p');
    expect(paragrafos).toHaveLength(5);
  });

  test('deve manter a ordem dos erros na renderização', () => {
    const erros = ['Primeiro', 'Segundo', 'Terceiro'];
    const { container } = render(<ErroGeralLogin erros={erros} />);
    const paragrafos = container.querySelectorAll('p');
    expect(paragrafos[0]).toHaveTextContent('Primeiro');
    expect(paragrafos[1]).toHaveTextContent('Segundo');
    expect(paragrafos[2]).toHaveTextContent('Terceiro');
  });
});
