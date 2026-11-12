import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import { HttpStatusCode } from 'axios';
import React from 'react';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditEmailButton from './modal-edit-email-button';

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    alterarEmail: jest.fn(),
  },
}));

describe('ModalEditEmail & ModalEditEmailButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({ auth: { usuarioLogin: 'diego.moreno' } }),
    );
  });

  it('C06/C07: abre modal ao clicar em Alterar, submete novo email e atualiza formPreview', async () => {
    (usuarioService.alterarEmail as jest.Mock).mockResolvedValue({
      status: HttpStatusCode.Ok,
      data: true,
    });

    const Wrapper: React.FC = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form} initialValues={{ email: 'antigo@sme.prefeitura.sp.gov.br' }}>
          <Form.Item name='email'>
            <input aria-label='preview-email' />
          </Form.Item>
          <ModalEditEmailButton formPreview={form} />
        </Form>
      );
    };

    render(<Wrapper />);

    fireEvent.click(screen.getByRole('button', { name: 'Alterar' }));
    expect(screen.getByText('Alterar e-mail')).toBeInTheDocument();

    const emailInputs = screen.getAllByRole('textbox');
    const modalEmailInput = emailInputs[emailInputs.length - 1];
    fireEvent.change(modalEmailInput, {
      target: { value: 'novo@sme.prefeitura.sp.gov.br' },
    });

    const alterarButtons = screen.getAllByRole('button', { name: 'Alterar' });
    fireEvent.click(alterarButtons[alterarButtons.length - 1]);

    await waitFor(() => {
      expect(usuarioService.alterarEmail).toHaveBeenCalledWith(
        'diego.moreno',
        'novo@sme.prefeitura.sp.gov.br',
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('Alterar e-mail')).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText('preview-email')).toHaveValue('novo@sme.prefeitura.sp.gov.br');
  });
});
