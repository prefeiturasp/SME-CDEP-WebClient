import { render, screen } from '~/tests/test-utils';
import { fireEvent } from '@testing-library/react';
import PageNotFound from './';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('PageNotFound', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renderiza o componente com status 404', () => {
    render(<PageNotFound />);

    const titleElement = screen.getByText('404');
    expect(titleElement).toBeInTheDocument();
  });

  test('renderiza a mensagem de página não encontrada', () => {
    render(<PageNotFound />);

    const messageElement = screen.getByText('Desculpe, a página que você visitou não existe.');
    expect(messageElement).toBeInTheDocument();
  });

  test('renderiza o botão Voltar', () => {
    render(<PageNotFound />);

    const buttonElement = screen.getByRole('button', { name: /voltar/i });
    expect(buttonElement).toBeInTheDocument();
  });

  test('navega para a raiz ao clicar no botão Voltar', () => {
    render(<PageNotFound />);

    const buttonElement = screen.getByRole('button', { name: /voltar/i });
    fireEvent.click(buttonElement);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
