import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import { HttpStatusCode } from 'axios';
import React from 'react';
import { CDEP_INPUT_CEP, CDEP_INPUT_ENDERECO, CDEP_INPUT_NUMERO } from '~/core/constants/ids/input';
import { useAppSelector } from '~/core/hooks/use-redux';
import enderecoService from '~/core/services/endereco-service';
import usuarioService from '~/core/services/usuario-service';
import ModalEditEnderecoButton from './modal-edit-endereco-button';

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('~/core/services/endereco-service', () => ({
  __esModule: true,
  default: {
    obterDadosCEP: jest.fn(),
  },
}));

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    alterarEndereco: jest.fn(),
  },
}));

const renderModalEndereco = () => {
  const Wrapper: React.FC = () => {
    const [form] = Form.useForm();
    return (
      <Form
        form={form}
        initialValues={{
          cep: '01001-000',
          endereco: 'Praça da Sé',
          numero: '100',
          complemento: 'Lado ímpar',
          bairro: 'Sé',
          cidade: 'São Paulo',
          estado: 'SP',
        }}
      >
        <Form.Item name='cep'>
          <input aria-label='preview-cep' />
        </Form.Item>
        <Form.Item name='endereco'>
          <input aria-label='preview-endereco' />
        </Form.Item>
        <Form.Item name='numero'>
          <input aria-label='preview-numero' />
        </Form.Item>
        <Form.Item name='complemento'>
          <input aria-label='preview-complemento' />
        </Form.Item>
        <Form.Item name='bairro'>
          <input aria-label='preview-bairro' />
        </Form.Item>
        <Form.Item name='cidade'>
          <input aria-label='preview-cidade' />
        </Form.Item>
        <Form.Item name='estado'>
          <input aria-label='preview-estado' />
        </Form.Item>
        <ModalEditEnderecoButton formPreview={form} />
      </Form>
    );
  };

  return render(<Wrapper />);
};

describe('ModalEditEndereco & ModalEditEnderecoButton', () => {
  jest.setTimeout(30000);

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({ auth: { usuarioLogin: 'diego.moreno' } }),
    );
  });

  it('C14/C15: consulta CEP 200 e 204, preenche endereço e foca campo adequado', async () => {
    (enderecoService.obterDadosCEP as jest.Mock).mockResolvedValueOnce({
      status: HttpStatusCode.Ok,
      data: {
        bairro: 'Centro',
        uf: 'SP',
        complemento: 'Sala 2',
        localidade: 'São Paulo',
        logradouro: 'Rua Direita',
      },
    });

    const { unmount } = renderModalEndereco();

    fireEvent.click(screen.getByRole('button', { name: 'Alterar' }));
    expect(screen.getByText('Alterar endereço')).toBeInTheDocument();

    fireEvent.change(document.getElementById(CDEP_INPUT_CEP) as HTMLInputElement, {
      target: { value: '01002-000' },
    });

    await waitFor(() => {
      expect(enderecoService.obterDadosCEP).toHaveBeenCalledWith('01002000');
    });

    await waitFor(() => {
      expect(document.getElementById(CDEP_INPUT_ENDERECO)).toHaveValue('Rua Direita');
    });
    expect(document.activeElement).toBe(document.getElementById(CDEP_INPUT_NUMERO));

    unmount();

    (enderecoService.obterDadosCEP as jest.Mock).mockResolvedValueOnce({
      status: HttpStatusCode.NoContent,
      data: {
        bairro: '',
        uf: 'SP',
        complemento: '',
        localidade: 'São Paulo',
        logradouro: '',
      },
    });

    renderModalEndereco();
    fireEvent.click(screen.getByRole('button', { name: 'Alterar' }));

    fireEvent.change(document.getElementById(CDEP_INPUT_CEP) as HTMLInputElement, {
      target: { value: '01003-000' },
    });

    await waitFor(() => {
      expect(enderecoService.obterDadosCEP).toHaveBeenCalledWith('01003000');
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(document.getElementById(CDEP_INPUT_ENDERECO));
    });
  });

  it('C16: exibe mensagem de erro quando obterDadosCEP falha com mensagens', async () => {
    (enderecoService.obterDadosCEP as jest.Mock).mockRejectedValue({
      response: { data: { mensagens: ['CEP inválido'] } },
    });

    renderModalEndereco();
    fireEvent.click(screen.getByRole('button', { name: 'Alterar' }));

    const cepInput = document.getElementById(CDEP_INPUT_CEP) as HTMLInputElement;
    fireEvent.change(cepInput, { target: { value: '99999-999' } });

    expect(await screen.findByText(/CEP inválido/)).toBeInTheDocument();
  });

  it('C17: submete alteração de endereço e atualiza formPreview', async () => {
    (usuarioService.alterarEndereco as jest.Mock).mockResolvedValue({
      status: HttpStatusCode.Ok,
      data: true,
    });

    renderModalEndereco();
    fireEvent.click(screen.getByRole('button', { name: 'Alterar' }));

    fireEvent.change(document.getElementById(CDEP_INPUT_ENDERECO) as HTMLInputElement, {
      target: { value: 'Av. Paulista' },
    });

    const alterarButtons = screen.getAllByRole('button', { name: 'Alterar' });
    fireEvent.click(alterarButtons[alterarButtons.length - 1]);

    await waitFor(() => {
      expect(usuarioService.alterarEndereco).toHaveBeenCalledWith(
        'diego.moreno',
        expect.objectContaining({ endereco: 'Av. Paulista' }),
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('Alterar endereço')).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText('preview-endereco')).toHaveValue('Av. Paulista');
  });
});
