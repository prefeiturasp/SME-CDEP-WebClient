import { render, screen, fireEvent } from '~/tests/test-utils';
import ExitButton from './';

describe('ExitButton', () => {
  test('deve renderizar o botão com label padrão "Sair"', () => {
    render(<ExitButton />);
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  test('deve renderizar o botão com label customizada', () => {
    render(<ExitButton label="Logout" />);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('deve renderizar botão circular', () => {
    render(<ExitButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ant-btn-circle');
  });

  test('deve renderizar botão do tipo primary', () => {
    render(<ExitButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ant-btn-primary');
  });

  test('deve renderizar botão de tamanho small', () => {
    render(<ExitButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ant-btn-sm');
  });

  test('deve chamar função onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<ExitButton onClick={handleClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('deve aceitar propriedade disabled', () => {
    render(<ExitButton disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('não deve estar desabilitado por padrão', () => {
    render(<ExitButton />);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  test('deve aceitar propriedades adicionais do ButtonProps', () => {
    render(<ExitButton data-testid="custom-exit-button" />);
    const button = screen.getByTestId('custom-exit-button');
    expect(button).toBeInTheDocument();
  });

  test('deve renderizar ícone de power off', () => {
    render(<ExitButton />);
    const button = screen.getByRole('button');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });
});
