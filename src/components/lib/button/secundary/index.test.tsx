import { render, screen } from '~/tests/test-utils';
import ButtonSecundary from './';
import { fireEvent } from '@testing-library/react';

describe('ButtonSecundary', () => {
  test('renderiza o botão do tipo default', () => {
    render(<ButtonSecundary>Clique aqui</ButtonSecundary>);
    const button = screen.getByRole('button', { name: /clique aqui/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ant-btn-default');
  });

  test('renderiza com estilo de fonte em negrito', () => {
    render(<ButtonSecundary>Botão</ButtonSecundary>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ fontWeight: 700 });
  });

  test('renderiza como botão em bloco (block)', () => {
    render(<ButtonSecundary>Botão</ButtonSecundary>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ant-btn-block');
  });

  test('chama função onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<ButtonSecundary onClick={handleClick}>Clique</ButtonSecundary>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('pode ser desabilitado', () => {
    render(<ButtonSecundary disabled>Botão Desabilitado</ButtonSecundary>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('aceita propriedades adicionais do ButtonProps', () => {
    render(
      <ButtonSecundary data-testid="custom-secundary-button" loading>
        Carregando...
      </ButtonSecundary>,
    );
    const button = screen.getByTestId('custom-secundary-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ant-btn-loading');
  });

  test('renderiza com ícone quando fornecido', () => {
    const TestIcon = () => <span data-testid="test-icon">🔍</span>;
    render(<ButtonSecundary icon={<TestIcon />}>Buscar</ButtonSecundary>);
    const icon = screen.getByTestId('test-icon');
    expect(icon).toBeInTheDocument();
  });

  test('renderiza com display flex e alinhamento central', () => {
    render(<ButtonSecundary>Botão</ButtonSecundary>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ display: 'flex', alignItems: 'center' });
  });
});
