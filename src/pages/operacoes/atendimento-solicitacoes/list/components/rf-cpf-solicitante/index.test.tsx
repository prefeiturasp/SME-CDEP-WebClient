import { render, screen, fireEvent, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import { InputRfCpfSolicitante } from './';
import usuarioService from '~/core/services/usuario-service';

const mockSetFieldValue = jest.fn();
const mockGetFieldValue = jest.fn();

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    obterRfCpf: jest.fn(),
  },
}));

jest.mock('antd/es/form/hooks/useFormInstance', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    setFieldValue: mockSetFieldValue,
    getFieldValue: mockGetFieldValue,
  })),
}));

jest.mock('antd/es/form/Form', () => ({
  __esModule: true,
  useWatch: jest.fn(() => ''),
}));

const WrapperWithForm = ({ obterFiltros }: { obterFiltros?: () => void }) => (
  <Form>
    <InputRfCpfSolicitante obterFiltros={obterFiltros} />
  </Form>
);

describe('InputRfCpfSolicitante', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetFieldValue.mockReset();
    mockGetFieldValue.mockReset();
  });

  test('renderiza o label "RF ou CPF do Solicitante"', () => {
    render(<WrapperWithForm />);
    expect(screen.getByText('RF ou CPF do Solicitante')).toBeInTheDocument();
  });

  test('renderiza o input com o placeholder correto', () => {
    render(<WrapperWithForm />);
    expect(screen.getByPlaceholderText('Informe o RF ou CPF do Solicitante')).toBeInTheDocument();
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

  test('C01: limpa o campo nomeSolicitante no form quando input é esvaziado e não limpa quando há texto', () => {
    render(<WrapperWithForm />);
    const input = screen.getByPlaceholderText('Informe o RF ou CPF do Solicitante');

    fireEvent.change(input, { target: { value: '1234567' } });
    expect(mockSetFieldValue).not.toHaveBeenCalledWith('nomeSolicitante', []);

    fireEvent.change(input, { target: { value: '' } });
    expect(mockSetFieldValue).toHaveBeenCalledWith('nomeSolicitante', []);
  });

  test('C02: atualiza nomeSolicitante sem lançar erro quando obterFiltros não é fornecido e busca retorna sucesso', async () => {
    (usuarioService.obterRfCpf as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: { nome: 'Maria Servidora' },
    });

    render(<WrapperWithForm />);
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(mockSetFieldValue).toHaveBeenCalledWith('nomeSolicitante', 'Maria Servidora');
    });
  });
});
