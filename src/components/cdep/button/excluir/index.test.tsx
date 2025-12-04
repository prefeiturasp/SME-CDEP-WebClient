import { render, screen } from '~/tests/test-utils';
import ButtonExcluir from './';
import { fireEvent } from '@testing-library/react';

describe('ButtonExcluir', () => {
  test('renderiza o botão com ícone de lixeira', () => {
    render(<ButtonExcluir />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ant-btn-default');
  });

  test('renderiza com propriedade danger', () => {
    render(<ButtonExcluir />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ant-btn-dangerous');
  });

  test('renderiza com largura fixa de 43px', () => {
    render(<ButtonExcluir />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ width: '43px' });
  });

  test('renderiza como botão em bloco (block)', () => {
    render(<ButtonExcluir />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ant-btn-block');
  });

  test('botão não está desabilitado por padrão', () => {
    render(<ButtonExcluir />);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  test('chama função onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<ButtonExcluir onClick={handleClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('pode ser desabilitado', () => {
    render(<ButtonExcluir disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('aceita propriedades adicionais do ButtonProps', () => {
    render(<ButtonExcluir data-testid="custom-delete-button" />);
    const button = screen.getByTestId('custom-delete-button');
    expect(button).toBeInTheDocument();
  });

  test('renderiza com display flex e alinhamento centralizado', () => {
    render(<ButtonExcluir />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });
  });
});
