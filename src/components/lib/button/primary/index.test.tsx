import { render, screen } from '~/tests/test-utils';
import ButtonPrimary from './';
import { fireEvent } from '@testing-library/react';

describe('ButtonPrimary', () => {
  test('renderiza o botão do tipo primary', () => {
    render(<ButtonPrimary>Clique aqui</ButtonPrimary>);
    const button = screen.getByRole('button', { name: /clique aqui/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ant-btn-primary');
  });

  test('renderiza com estilo de fonte em negrito', () => {
    render(<ButtonPrimary>Botão</ButtonPrimary>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ fontWeight: 700 });
  });

  test('renderiza como botão em bloco (block)', () => {
    render(<ButtonPrimary>Botão</ButtonPrimary>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ant-btn-block');
  });

  test('chama função onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<ButtonPrimary onClick={handleClick}>Clique</ButtonPrimary>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('pode ser desabilitado', () => {
    render(<ButtonPrimary disabled>Botão Desabilitado</ButtonPrimary>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('aceita propriedades adicionais do ButtonProps', () => {
    render(
      <ButtonPrimary data-testid="custom-primary-button" loading>
        Carregando...
      </ButtonPrimary>,
    );
    const button = screen.getByTestId('custom-primary-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ant-btn-loading');
  });

  test('renderiza com ícone quando fornecido', () => {
    const TestIcon = () => <span data-testid="test-icon">🔍</span>;
    render(<ButtonPrimary icon={<TestIcon />}>Buscar</ButtonPrimary>);
    const icon = screen.getByTestId('test-icon');
    expect(icon).toBeInTheDocument();
  });
});
