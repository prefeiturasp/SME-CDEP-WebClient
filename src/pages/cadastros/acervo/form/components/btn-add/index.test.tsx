import { render, screen } from '~/tests/test-utils';
import { fireEvent } from '@testing-library/react';
import { ButtonAdicionar } from './';

describe('ButtonAdicionar', () => {
  test('renderiza o componente corretamente', () => {
    render(<ButtonAdicionar />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
  });

  test('renderiza o ícone de plus', () => {
    const { container } = render(<ButtonAdicionar />);

    const iconElement = container.querySelector('svg');
    expect(iconElement).toBeInTheDocument();
  });

  test('botão tem o tipo default', () => {
    const { container } = render(<ButtonAdicionar />);

    const buttonElement = container.querySelector('button');
    expect(buttonElement).toHaveClass('ant-btn-default');
  });

  test('botão tem a propriedade block', () => {
    const { container } = render(<ButtonAdicionar />);

    const buttonElement = container.querySelector('button');
    expect(buttonElement).toHaveClass('ant-btn-block');
  });

  test('aplica estilos customizados corretamente', () => {
    const { container } = render(<ButtonAdicionar />);

    const buttonElement = container.querySelector('button') as HTMLElement;
    expect(buttonElement).toHaveStyle({ marginTop: '24px' });
    expect(buttonElement).toHaveStyle({ fontSize: '16px' });
    expect(buttonElement).toHaveStyle({ width: '43px' });
  });

  test('executa função onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<ButtonAdicionar onClick={handleClick} />);

    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('aceita props adicionais do ButtonProps', () => {
    render(<ButtonAdicionar disabled data-testid="custom-button" />);

    const buttonElement = screen.getByTestId('custom-button');
    expect(buttonElement).toBeDisabled();
  });

  test('mantém outras props passadas via rest', () => {
    const { container } = render(<ButtonAdicionar className="custom-class" />);

    const buttonElement = container.querySelector('button');
    expect(buttonElement).toHaveClass('custom-class');
  });
});
