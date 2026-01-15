import { render, screen } from '~/tests/test-utils';
import LimparBuscaButton from './';
import { fireEvent } from '@testing-library/react';

describe('LimparBuscaButton', () => {
  test('renderiza o botão com texto "Limpar busca"', () => {
    render(<LimparBuscaButton buttonProps={{}} />);
    const button = screen.getByRole('button', { name: /limpar busca/i });
    expect(button).toBeInTheDocument();
  });

  test('chama função onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<LimparBuscaButton buttonProps={{ onClick: handleClick }} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('pode ser desabilitado através de buttonProps', () => {
    render(<LimparBuscaButton buttonProps={{ disabled: true }} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('aceita propriedades do ButtonProps', () => {
    render(
      <LimparBuscaButton
        buttonProps={{ type: 'primary', loading: true, 'data-testid': 'clear-search-btn' }}
      />,
    );
    const button = screen.getByTestId('clear-search-btn');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ant-btn-primary');
    expect(button).toHaveClass('ant-btn-loading');
  });

  test('renderiza com tipo danger', () => {
    render(<LimparBuscaButton buttonProps={{ danger: true }} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ant-btn-dangerous');
  });

  test('aceita className customizado', () => {
    render(<LimparBuscaButton buttonProps={{ className: 'custom-class' }} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  test('aceita estilo customizado', () => {
    render(
      <LimparBuscaButton buttonProps={{ style: { width: '200px' } }} />,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ width: '200px' });
  });

  test('aceita ícone através de buttonProps', () => {
    const TestIcon = () => <span data-testid="test-icon">🔍</span>;
    render(<LimparBuscaButton buttonProps={{ icon: <TestIcon /> }} />);
    const icon = screen.getByTestId('test-icon');
    expect(icon).toBeInTheDocument();
  });
});
