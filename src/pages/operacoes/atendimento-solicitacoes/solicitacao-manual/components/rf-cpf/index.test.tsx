import { Form } from 'antd';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import usuarioService from '~/core/services/usuario-service';
import { InputRfCpf } from './index';

jest.mock('antd/es/form/Form', () => jest.requireActual('antd/lib/form/Form'));
jest.mock('antd/es/form/hooks/useFormInstance', () =>
  jest.requireActual('antd/lib/form/hooks/useFormInstance'),
);

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    obterRfCpf: jest.fn(),
  },
}));

const mockedObterRfCpf = usuarioService.obterRfCpf as jest.Mock;

const WrapperForm = ({ onValuesCheck }: { onValuesCheck?: (values: unknown) => void }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form}>
      <InputRfCpf />
      {onValuesCheck ? (
        <button type='button' onClick={() => onValuesCheck(form.getFieldsValue(true))}>
          Ler Form
        </button>
      ) : null}
    </Form>
  );
};

describe('InputRfCpf (src/pages/operacoes/atendimento-solicitacoes/solicitacao-manual/components/rf-cpf/index.tsx)', () => {
  beforeEach(() => {
    mockedObterRfCpf.mockReset();
  });

  it('C01: deve renderizar label, placeholder e limite de 11 caracteres', () => {
    render(<WrapperForm />);

    expect(screen.getByText('RF ou CPF')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('Informe o RF ou CPF');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('maxlength', '11');
  });

  it('C02: ao buscar RF/CPF, deve preencher dadosSolicitante e dataSolicitacao no sucesso e limpar na falha', async () => {
    const lerValues = jest.fn();
    mockedObterRfCpf.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        id: 10,
        nome: 'Carlos Solicitante',
        login: '12345678900',
        email: 'carlos@teste.com',
      },
    });

    render(<WrapperForm onValuesCheck={lerValues} />);

    const input = screen.getByPlaceholderText('Informe o RF ou CPF');
    fireEvent.change(input, { target: { value: '12345678900' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(mockedObterRfCpf).toHaveBeenCalledWith('12345678900');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Ler Form' }));
    expect(lerValues).toHaveBeenLastCalledWith(
      expect.objectContaining({
        dadosSolicitante: expect.objectContaining({
          id: 10,
          nome: 'Carlos Solicitante',
        }),
        dataSolicitacao: expect.anything(),
      }),
    );

    // Falha ao buscar RF/CPF limpa dadosSolicitante e dataSolicitacao
    mockedObterRfCpf.mockResolvedValueOnce({ sucesso: false });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(mockedObterRfCpf).toHaveBeenCalledTimes(2);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Ler Form' }));
    expect(lerValues).toHaveBeenLastCalledWith(
      expect.objectContaining({
        dadosSolicitante: [],
        dataSolicitacao: null,
      }),
    );
  });

  it('C03: deve limpar dadosSolicitante quando o input for esvaziado', async () => {
    const lerValues = jest.fn();
    mockedObterRfCpf.mockResolvedValueOnce({
      sucesso: true,
      dados: { id: 1, nome: 'Ana', login: '999' },
    });

    render(<WrapperForm onValuesCheck={lerValues} />);
    const input = screen.getByPlaceholderText('Informe o RF ou CPF');

    fireEvent.change(input, { target: { value: '999' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => expect(mockedObterRfCpf).toHaveBeenCalled());

    // Alterar para outro valor não vazio mantém o estado
    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ler Form' }));
    expect(lerValues).toHaveBeenLastCalledWith(
      expect.objectContaining({
        dadosSolicitante: expect.objectContaining({ nome: 'Ana' }),
      }),
    );

    // Esvaziar o campo limpa dadosSolicitante para []
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ler Form' }));
    expect(lerValues).toHaveBeenLastCalledWith(
      expect.objectContaining({
        dadosSolicitante: [],
      }),
    );
  });
});
