import { render, screen } from '~/tests/test-utils';
import { fireEvent } from '@testing-library/react';
import PageForbidden from './';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('PageForbidden', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renderiza o componente com status 403', () => {
    render(<PageForbidden />);

    const titleElement = screen.getByText('403');
    expect(titleElement).toBeInTheDocument();
  });

  test('renderiza a mensagem de permissão negada', () => {
    render(<PageForbidden />);

    const messageElement = screen.getByText('Você não tem permissão a esta funcionalidade!');
    expect(messageElement).toBeInTheDocument();
  });

  test('renderiza o botão Voltar', () => {
    render(<PageForbidden />);

    const buttonElement = screen.getByRole('button', { name: /voltar/i });
    expect(buttonElement).toBeInTheDocument();
  });

  test('navega para a página principal ao clicar no botão Voltar', () => {
    render(<PageForbidden />);

    const buttonElement = screen.getByRole('button', { name: /voltar/i });
    fireEvent.click(buttonElement);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
