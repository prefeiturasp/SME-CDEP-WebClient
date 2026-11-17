import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import { HttpStatusCode } from 'axios';
import React from 'react';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditTipoUsuarioButton from './modal-edit-tipo-usuario-button';

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    alterarTipoUsuario: jest.fn(),
  },
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('~/components/cdep/input/tipo-usuario', () => {
  const { Form: AntForm } = jest.requireActual('antd');
  const MockInputTipoUsuario = () => (
    <AntForm.Item name='tipo'>
      <input aria-label='modal-tipo-usuario' />
    </AntForm.Item>
  );
  return MockInputTipoUsuario;
});

describe('ModalEditTipoUsuario & ModalEditTipoUsuarioButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({ auth: { usuarioLogin: 'diego.moreno' } }),
    );
  });

  it('C10/C11: abre modal, submete alteração de tipo e atualiza formPreview', async () => {
    (usuarioService.alterarTipoUsuario as jest.Mock).mockResolvedValue({
      status: HttpStatusCode.Ok,
      data: true,
    });

    const Wrapper: React.FC = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form} initialValues={{ tipo: 1 }}>
          <Form.Item name='tipo'>
            <input aria-label='preview-tipo' />
          </Form.Item>
          <ModalEditTipoUsuarioButton formPreview={form} />
        </Form>
      );
    };

    render(<Wrapper />);

    fireEvent.click(screen.getByRole('button', { name: 'Alterar' }));
    expect(screen.getByText('Alterar o tipo')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('modal-tipo-usuario'), { target: { value: '2' } });

    const alterarButtons = screen.getAllByRole('button', { name: 'Alterar' });
    fireEvent.click(alterarButtons[alterarButtons.length - 1]);

    await waitFor(() => {
      expect(usuarioService.alterarTipoUsuario).toHaveBeenCalledWith('diego.moreno', '2');
    });

    await waitFor(() => {
      expect(screen.queryByText('Alterar o tipo')).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText('preview-tipo')).toHaveValue('2');
  });
});
