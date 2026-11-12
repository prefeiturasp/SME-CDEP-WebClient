import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import { HttpStatusCode } from 'axios';
import React from 'react';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditTelefoneButton from './modal-edit-telefone-button';

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
    alterarTelefone: jest.fn(),
  },
}));

describe('ModalEditTelefone & ModalEditTelefoneButton', () => {
  jest.setTimeout(30000);

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({ auth: { usuarioLogin: 'diego.moreno' } }),
    );
  });

  it('C08/C09: abre modal ao clicar em Alterar, submete telefone e atualiza formPreview', async () => {
    (usuarioService.alterarTelefone as jest.Mock).mockResolvedValue({
      status: HttpStatusCode.Ok,
      data: true,
    });

    const Wrapper: React.FC = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form} initialValues={{ telefone: '11911112222' }}>
          <Form.Item name='telefone'>
            <input aria-label='preview-telefone' />
          </Form.Item>
          <ModalEditTelefoneButton formPreview={form} />
        </Form>
      );
    };

    render(<Wrapper />);

    fireEvent.click(screen.getByRole('button', { name: 'Alterar' }));
    expect(screen.getByText('Alterar telefone')).toBeInTheDocument();

    const inputs = screen.getAllByRole('textbox');
    const modalTelInput = inputs[inputs.length - 1];
    fireEvent.change(modalTelInput, { target: { value: '(11) 98888-7777' } });

    const alterarButtons = screen.getAllByRole('button', { name: 'Alterar' });
    fireEvent.click(alterarButtons[alterarButtons.length - 1]);

    await waitFor(() => {
      expect(usuarioService.alterarTelefone).toHaveBeenCalledWith(
        'diego.moreno',
        '(11) 98888-7777',
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('Alterar telefone')).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText('preview-telefone')).toHaveValue('(11) 98888-7777');
  });
});
