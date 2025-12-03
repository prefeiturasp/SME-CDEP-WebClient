import { render, screen } from '~/tests/test-utils';
import ButtonOrdenacao from './';
import { fireEvent } from '@testing-library/react';
import { TipoOrdenacaoEnum } from '~/core/enum/tipo-ordenacao';

describe('ButtonOrdenacao', () => {
  test('renderiza o botão com texto "Ordenar"', () => {
    const handleClick = jest.fn();
    render(<ButtonOrdenacao onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /ordenar/i });
    expect(button).toBeInTheDocument();
  });

  test('renderiza ícone de ordenação', () => {
    const handleClick = jest.fn();
    const { container } = render(<ButtonOrdenacao onClick={handleClick} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  test('botão possui estilo com font-weight 700', () => {
    const handleClick = jest.fn();
    render(<ButtonOrdenacao onClick={handleClick} />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ fontWeight: 700 });
  });

  test('botão possui display flex e alinhamento centralizado', () => {
    const handleClick = jest.fn();
    render(<ButtonOrdenacao onClick={handleClick} />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ display: 'flex', alignItems: 'center' });
  });

  test('abre dropdown com opções ao clicar', () => {
    const handleClick = jest.fn();
    render(<ButtonOrdenacao onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /ordenar/i });
    fireEvent.click(button);

    expect(screen.getByText('Decrescente por data de registro')).toBeInTheDocument();
    expect(screen.getByText('Por ordem alfabética (A–Z)')).toBeInTheDocument();
    expect(screen.getByText('Por ordem alfabética (Z–A)')).toBeInTheDocument();
    expect(screen.getByText('Crescente por Tombo/Código')).toBeInTheDocument();
    expect(screen.getByText('Decrescente por Tombo/Código')).toBeInTheDocument();
  });

  test('chama onClick com TipoOrdenacaoEnum.DATA ao selecionar opção de data', () => {
    const handleClick = jest.fn();
    render(<ButtonOrdenacao onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /ordenar/i });
    fireEvent.click(button);

    const opcaoData = screen.getByText('Decrescente por data de registro');
    fireEvent.click(opcaoData);

    expect(handleClick).toHaveBeenCalledWith(TipoOrdenacaoEnum.DATA);
  });

  test('chama onClick com TipoOrdenacaoEnum.AZ ao selecionar ordem A-Z', () => {
    const handleClick = jest.fn();
    render(<ButtonOrdenacao onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /ordenar/i });
    fireEvent.click(button);

    const opcaoAZ = screen.getByText('Por ordem alfabética (A–Z)');
    fireEvent.click(opcaoAZ);

    expect(handleClick).toHaveBeenCalledWith(TipoOrdenacaoEnum.AZ);
  });

  test('chama onClick com TipoOrdenacaoEnum.ZA ao selecionar ordem Z-A', () => {
    const handleClick = jest.fn();
    render(<ButtonOrdenacao onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /ordenar/i });
    fireEvent.click(button);

    const opcaoZA = screen.getByText('Por ordem alfabética (Z–A)');
    fireEvent.click(opcaoZA);

    expect(handleClick).toHaveBeenCalledWith(TipoOrdenacaoEnum.ZA);
  });

  test('chama onClick com TipoOrdenacaoEnum.CODIGO_ASCENDENTE', () => {
    const handleClick = jest.fn();
    render(<ButtonOrdenacao onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /ordenar/i });
    fireEvent.click(button);

    const opcaoCodigo = screen.getByText('Crescente por Tombo/Código');
    fireEvent.click(opcaoCodigo);

    expect(handleClick).toHaveBeenCalledWith(TipoOrdenacaoEnum.CODIGO_ASCENDENTE);
  });

  test('chama onClick com TipoOrdenacaoEnum.CODIGO_DESCENDENTE', () => {
    const handleClick = jest.fn();
    render(<ButtonOrdenacao onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /ordenar/i });
    fireEvent.click(button);

    const opcaoCodigo = screen.getByText('Decrescente por Tombo/Código');
    fireEvent.click(opcaoCodigo);

    expect(handleClick).toHaveBeenCalledWith(TipoOrdenacaoEnum.CODIGO_DESCENDENTE);
  });
});
