import { render, screen, fireEvent, waitFor } from '~/tests/test-utils';
import React from 'react';
import { Form } from 'antd';
import { InputRfCpfSolicitante } from './';
import usuarioService from '~/core/services/usuario-service';

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    obterRfCpf: jest.fn(),
  },
}));

jest.mock('antd/es/form/hooks/useFormInstance', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    setFieldValue: jest.fn(),
    getFieldValue: jest.fn(),
  })),
}));

jest.mock('antd/es/form/Form', () => ({
  __esModule: true,
  useWatch: jest.fn(() => ''),
}));

const WrapperWithForm: React.FC<{ obterFiltros?: () => void }> = ({ obterFiltros }) => (
  <Form>
    <InputRfCpfSolicitante obterFiltros={obterFiltros} />
  </Form>
);

describe('InputRfCpfSolicitante', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza o label "RF ou CPF do Solicitante"', () => {
    render(<WrapperWithForm />);
    expect(screen.getByText('RF ou CPF do Solicitante')).toBeInTheDocument();
  });

  test('renderiza o input com o placeholder correto', () => {
    render(<WrapperWithForm />);
    expect(
      screen.getByPlaceholderText('Informe o RF ou CPF do Solicitante'),
    ).toBeInTheDocument();
  });

  test('input possui limite máximo de 11 caracteres', () => {
    render(<WrapperWithForm />);
    const input = screen.getByPlaceholderText('Informe o RF ou CPF do Solicitante');
    expect(input).toHaveAttribute('maxlength', '11');
  });

  test('chama usuarioService.obterRfCpf ao acionar a busca', async () => {
    (usuarioService.obterRfCpf as jest.Mock).mockResolvedValue({ sucesso: false });
    render(<WrapperWithForm />);
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    await waitFor(() => {
      expect(usuarioService.obterRfCpf).toHaveBeenCalled();
    });
  });

  test('chama obterFiltros quando a busca retorna sucesso', async () => {
    const mockObterFiltros = jest.fn();
    (usuarioService.obterRfCpf as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: { nome: 'João Silva' },
    });
    render(<WrapperWithForm obterFiltros={mockObterFiltros} />);
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    await waitFor(() => {
      expect(mockObterFiltros).toHaveBeenCalled();
    });
  });

  test('não chama obterFiltros quando a busca falha', async () => {
    const mockObterFiltros = jest.fn();
    (usuarioService.obterRfCpf as jest.Mock).mockResolvedValue({ sucesso: false });
    render(<WrapperWithForm obterFiltros={mockObterFiltros} />);
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    await waitFor(() => {
      expect(usuarioService.obterRfCpf).toHaveBeenCalled();
    });
    expect(mockObterFiltros).not.toHaveBeenCalled();
  });
});
