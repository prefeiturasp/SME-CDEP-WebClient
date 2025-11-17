import { render, screen } from '~/tests/test-utils';
import ButtonVoltar from './';
import { fireEvent } from '@testing-library/react';

describe('ButtonVoltar', () => {
  test('renderiza o botão com ícone de seta para esquerda', () => {
    render(<ButtonVoltar />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ant-btn-default');
  });

  test('renderiza com largura fixa de 43px', () => {
    render(<ButtonVoltar />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ width: '43px' });
  });

  test('botão não está desabilitado por padrão', () => {
    render(<ButtonVoltar />);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  test('chama função onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<ButtonVoltar onClick={handleClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('aceita propriedades adicionais do ButtonProps', () => {
    render(<ButtonVoltar data-testid="custom-back-button" />);
    const button = screen.getByTestId('custom-back-button');
    expect(button).toBeInTheDocument();
  });
});
