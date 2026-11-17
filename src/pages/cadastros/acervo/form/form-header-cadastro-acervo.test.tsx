import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form, Input } from 'antd';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { notification } from '~/components/lib/notification';
import {
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_EXCLUIR,
  CDEP_BUTTON_SALVAR_ALTERAR,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import {
  ACERVO_EXCLUIDO_SUCESSO,
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_CANCELAR_ALTERACOES_AO_SAIR_DA_PAGINA,
  DESEJA_EXCLUIR_ACERVO,
} from '~/core/constants/mensagens';
import { FormPageConfigCadastroAcervoProps } from '~/core/dto/form-cadastro-acervo';
import { ROUTES } from '~/core/enum/routes';
import { confirmacao } from '~/core/services/alerta-service';
import { deletarRegistro } from '~/core/services/api';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import FormHeaderCadastroAcervo from './form-header-cadastro-acervo';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

jest.mock('~/core/services/api', () => ({
  deletarRegistro: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
  },
}));

type PermissaoValue = React.ComponentProps<typeof PermissaoContext.Provider>['value'];

const renderHeader = (options?: { route?: string; podeExcluir?: boolean }) => {
  const route = options?.route ?? '/cadastros/acervo/novo';
  const podeExcluir = options?.podeExcluir ?? true;

  const Wrapper: React.FC = () => {
    const [form] = Form.useForm();
    return (
      <MemoryRouter initialEntries={[route]}>
        <PermissaoContext.Provider
          value={{ permissao: { podeExcluir } } as unknown as PermissaoValue}
        >
          <Form form={form} initialValues={{ titulo: '' }}>
            <Routes>
              <Route
                path='/cadastros/acervo/novo'
                element={
                  <>
                    <FormHeaderCadastroAcervo
                      fieldsConfig={{ urlBase: '/api/acervo' } as FormPageConfigCadastroAcervoProps}
                    />
                    <Form.Item name='titulo'>
                      <Input aria-label='titulo' />
                    </Form.Item>
                  </>
                }
              />
              <Route
                path='/cadastros/acervo/editar/:id'
                element={
                  <>
                    <FormHeaderCadastroAcervo
                      fieldsConfig={{ urlBase: '/api/acervo' } as FormPageConfigCadastroAcervoProps}
                    />
                    <Form.Item name='titulo'>
                      <Input aria-label='titulo' />
                    </Form.Item>
                  </>
                }
              />
            </Routes>
          </Form>
        </PermissaoContext.Provider>
      </MemoryRouter>
    );
  };

  return render(<Wrapper />);
};

describe('FormHeaderCadastroAcervo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('C04: modo criação exibe "Novo Acervo", "Salvar" e volta direto sem alterações', () => {
    renderHeader();

    expect(screen.getByText('Novo Acervo')).toBeInTheDocument();
    expect(document.getElementById(CDEP_BUTTON_SALVAR_ALTERAR)).toHaveTextContent('Salvar');
    expect(document.getElementById(CDEP_BUTTON_EXCLUIR)).not.toBeInTheDocument();
    expect(document.getElementById(CDEP_BUTTON_CANCELAR)).toBeDisabled();

    fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR) as HTMLElement);
    expect(confirmacao).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ACERVO);
  });

  it('C06: pede confirmação em Cancelar quando formulário foi alterado', async () => {
    (confirmacao as jest.Mock).mockImplementation(({ onOk }) => onOk());
    renderHeader();

    const input = screen.getByLabelText('titulo') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Título Modificado' } });

    expect(document.getElementById(CDEP_BUTTON_CANCELAR)).toBeEnabled();

    fireEvent.click(document.getElementById(CDEP_BUTTON_CANCELAR) as HTMLElement);
    expect(confirmacao).toHaveBeenCalledWith(
      expect.objectContaining({ content: DESEJA_CANCELAR_ALTERACOES }),
    );
    await waitFor(() => {
      expect(document.getElementById(CDEP_BUTTON_CANCELAR)).toBeDisabled();
    });
  });

  it('C07: pede confirmação em Voltar quando formulário foi alterado', () => {
    (confirmacao as jest.Mock).mockImplementation(({ onOk }) => onOk());
    renderHeader();

    const input = screen.getByLabelText('titulo') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Outro Título' } });

    fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR) as HTMLElement);
    expect(confirmacao).toHaveBeenCalledWith(
      expect.objectContaining({ content: DESEJA_CANCELAR_ALTERACOES_AO_SAIR_DA_PAGINA }),
    );
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ACERVO);
  });

  it('C05/C08: modo edição exclui registro com sucesso e respeita podeExcluir', async () => {
    (confirmacao as jest.Mock).mockImplementation(({ onOk }) => onOk());
    (deletarRegistro as jest.Mock)
      .mockResolvedValueOnce({ sucesso: true })
      .mockResolvedValueOnce({ sucesso: false });

    renderHeader({
      route: '/cadastros/acervo/editar/55',
      podeExcluir: true,
    });

    expect(screen.getByText('Editar Acervo')).toBeInTheDocument();
    expect(document.getElementById(CDEP_BUTTON_SALVAR_ALTERAR)).toHaveTextContent('Alterar');

    fireEvent.click(document.getElementById(CDEP_BUTTON_EXCLUIR) as HTMLElement);
    expect(confirmacao).toHaveBeenCalledWith(
      expect.objectContaining({ content: DESEJA_EXCLUIR_ACERVO }),
    );

    await waitFor(() => {
      expect(deletarRegistro).toHaveBeenCalledWith('/api/acervo/55');
    });
    expect(notification.success).toHaveBeenCalledWith({
      message: 'Sucesso',
      description: ACERVO_EXCLUIDO_SUCESSO,
    });
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ACERVO);

    cleanup();
    jest.clearAllMocks();
    (confirmacao as jest.Mock).mockImplementation(({ onOk }) => onOk());
    (deletarRegistro as jest.Mock).mockResolvedValueOnce({ sucesso: false });

    renderHeader({ route: '/cadastros/acervo/editar/55', podeExcluir: true });
    fireEvent.click(document.getElementById(CDEP_BUTTON_EXCLUIR) as HTMLElement);
    await waitFor(() => expect(deletarRegistro).toHaveBeenCalledTimes(1));
    expect(notification.success).not.toHaveBeenCalled();

    cleanup();
    jest.clearAllMocks();
    renderHeader({ route: '/cadastros/acervo/editar/55', podeExcluir: false });
    expect(document.getElementById(CDEP_BUTTON_EXCLUIR)).toBeDisabled();
    fireEvent.click(document.getElementById(CDEP_BUTTON_EXCLUIR) as HTMLElement);
    expect(confirmacao).not.toHaveBeenCalled();
    expect(deletarRegistro).not.toHaveBeenCalled();
  });
});
