import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormInstance } from 'antd/es/form/Form';
import { HttpStatusCode } from 'axios';
import { notification } from '~/components/lib/notification';
import { confirmacao } from '~/core/services/alerta-service';
import ModalEditDefault from './modal-edit-default';

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

const createMockForm = (overrides?: Partial<FormInstance>) =>
  ({
    validateFields: jest.fn().mockResolvedValue({}),
    getFieldsValue: jest.fn().mockReturnValue({ email: 'novo@sme.prefeitura.sp.gov.br' }),
    resetFields: jest.fn(),
    isFieldsTouched: jest.fn().mockReturnValue(false),
    ...overrides,
  } as unknown as FormInstance);

describe('ModalEditDefault', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('C01: valida formulário, chama service, updateFields, notifica sucesso e fecha modal', async () => {
    const service = jest.fn().mockResolvedValue({ status: HttpStatusCode.Ok, data: true });
    const updateFields = jest.fn();
    const closeModal = jest.fn();
    const form = createMockForm();

    render(
      <ModalEditDefault
        title='Editar campo'
        service={service}
        updateFields={updateFields}
        form={form}
        mensagemConfirmarCancelar='Descartar?'
        closeModal={closeModal}
      >
        <div>Conteúdo</div>
      </ModalEditDefault>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Alterar' }));

    await waitFor(() => {
      expect(service).toHaveBeenCalledWith({ email: 'novo@sme.prefeitura.sp.gov.br' });
    });

    expect(updateFields).toHaveBeenCalledWith({ email: 'novo@sme.prefeitura.sp.gov.br' });
    expect(notification.success).toHaveBeenCalledWith({
      message: 'Sucesso',
      description: 'Registro alterado com sucesso!',
    });
    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it('C02: não notifica sucesso quando resposta.data é false ou updateFields ausente', async () => {
    const service = jest.fn().mockResolvedValue({ status: HttpStatusCode.Ok, data: false });
    const closeModal = jest.fn();
    const form = createMockForm();

    render(
      <ModalEditDefault
        title='Editar campo'
        service={service}
        form={form}
        mensagemConfirmarCancelar='Descartar?'
        closeModal={closeModal}
      >
        <div>Conteúdo</div>
      </ModalEditDefault>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Alterar' }));

    await waitFor(() => expect(closeModal).toHaveBeenCalledTimes(1));
    expect(notification.success).not.toHaveBeenCalled();
  });

  it('C03: exibe notification.error para mensagens de erro da API e mantém modal aberto', async () => {
    const service = jest
      .fn()
      .mockRejectedValueOnce({
        response: { data: { mensagens: ['Erro 1', 'Erro 2'] } },
      })
      .mockRejectedValueOnce(new Error('Erro genérico'));
    const closeModal = jest.fn();
    const form = createMockForm();

    render(
      <ModalEditDefault
        title='Editar campo'
        service={service}
        form={form}
        mensagemConfirmarCancelar='Descartar?'
        closeModal={closeModal}
      >
        <div>Conteúdo</div>
      </ModalEditDefault>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Alterar' }));

    await waitFor(() => expect(notification.error).toHaveBeenCalledTimes(2));
    expect(notification.error).toHaveBeenCalledWith({ message: 'Erro', description: 'Erro 1' });
    expect(notification.error).toHaveBeenCalledWith({ message: 'Erro', description: 'Erro 2' });
    expect(closeModal).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Alterar' }));
    await waitFor(() => expect(service).toHaveBeenCalledTimes(2));
    expect(notification.error).toHaveBeenCalledTimes(2);
  });

  it('C04/C05: cancela diretamente se não houver edição e pede confirmação se isFieldsTouched=true', () => {
    const closeModal = jest.fn();
    const formUntouched = createMockForm({ isFieldsTouched: jest.fn().mockReturnValue(false) });

    const { unmount } = render(
      <ModalEditDefault
        title='Editar campo'
        service={jest.fn()}
        form={formUntouched}
        mensagemConfirmarCancelar='Descartar?'
        closeModal={closeModal}
      >
        <div>Conteúdo</div>
      </ModalEditDefault>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(confirmacao).not.toHaveBeenCalled();
    expect(formUntouched.resetFields).toHaveBeenCalledTimes(1);
    expect(closeModal).toHaveBeenCalledTimes(1);

    unmount();
    jest.clearAllMocks();

    const formTouched = createMockForm({ isFieldsTouched: jest.fn().mockReturnValue(true) });
    (confirmacao as jest.Mock).mockImplementation(({ onOk }) => onOk());

    render(
      <ModalEditDefault
        title='Editar campo'
        service={jest.fn()}
        form={formTouched}
        mensagemConfirmarCancelar='Confirmar descarte?'
        closeModal={closeModal}
      >
        <div>Conteúdo</div>
      </ModalEditDefault>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(confirmacao).toHaveBeenCalledWith(
      expect.objectContaining({ content: 'Confirmar descarte?' }),
    );
    expect(formTouched.resetFields).toHaveBeenCalledTimes(1);
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
