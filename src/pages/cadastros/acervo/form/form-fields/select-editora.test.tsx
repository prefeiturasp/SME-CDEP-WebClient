import React from 'react';
import { render, screen, fireEvent, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import SelectEditora from './select-editora';
import { CDEP_SELECT_EDITORA } from '~/core/constants/ids/select';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import * as editoraService from '~/core/services/editora-service';
import * as perfilUtils from '~/core/utils/perfil';

jest.mock('~/core/services/editora-service');
jest.mock('~/core/utils/perfil');
jest.mock('~/components/cdep/cadastros/auxiliares/form', () => {
  const MockFormCadastrosAuxiliares = ({
    setOpenModal,
  }: {
    setOpenModal: (open: boolean, update?: boolean) => void;
  }) => (
    <div data-testid='mock-modal-editora'>
      <button onClick={() => setOpenModal(false, true)}>Salvar e Fechar</button>
      <button onClick={() => setOpenModal(false, false)}>Cancelar</button>
    </div>
  );
  MockFormCadastrosAuxiliares.displayName = 'MockFormCadastrosAuxiliares';
  return MockFormCadastrosAuxiliares;
});

type PermissaoValue = React.ComponentProps<typeof PermissaoContext.Provider>['value'];

describe('SelectEditora', () => {
  const mockObterEditoraResumido = editoraService.obterEditoraResumido as jest.Mock;
  const mockObterPermissaoPorMenu = perfilUtils.obterPermissaoPorMenu as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockObterPermissaoPorMenu.mockReturnValue({
      podeConsultar: true,
      podeIncluir: true,
      podeAlterar: true,
      podeExcluir: true,
    });
  });

  const renderComponent = (desabilitarCampos = false) => {
    const permissaoValue: PermissaoValue = {
      desabilitarCampos,
      setDesabilitarCampos: jest.fn(),
      permissao: {} as any,
    };

    return render(
      <PermissaoContext.Provider value={permissaoValue}>
        <Form>
          <SelectEditora
            formItemProps={{ extra: <span data-testid='extra-editora'>Extra</span> }}
          />
        </Form>
      </PermissaoContext.Provider>,
    );
  };

  test('carrega e exibe opções de editora com sucesso', async () => {
    mockObterEditoraResumido.mockResolvedValueOnce({
      sucesso: true,
      dados: [
        { id: '1', nome: 'Companhia das Letras' },
        { id: '2', nome: 'Editora Abril' },
      ],
    });

    renderComponent();

    await waitFor(() => {
      expect(mockObterEditoraResumido).toHaveBeenCalledTimes(1);
    });

    const select = document.querySelector(`#${CDEP_SELECT_EDITORA}`);
    expect(select).toBeInTheDocument();
    expect(screen.getByTestId('extra-editora')).toBeInTheDocument();
  });

  test('lida com falha no serviço limpando opções', async () => {
    mockObterEditoraResumido.mockResolvedValueOnce({
      sucesso: false,
      dados: null,
    });

    renderComponent();

    await waitFor(() => {
      expect(mockObterEditoraResumido).toHaveBeenCalledTimes(1);
    });

    const select = document.querySelector(`#${CDEP_SELECT_EDITORA}`);
    expect(select).toBeInTheDocument();
  });

  test('abre modal de cadastro auxiliar e recarrega dados ao salvar', async () => {
    mockObterEditoraResumido.mockResolvedValue({
      sucesso: true,
      dados: [{ id: '1', nome: 'Companhia das Letras' }],
    });

    renderComponent();

    await waitFor(() => {
      expect(mockObterEditoraResumido).toHaveBeenCalledTimes(1);
    });

    const addBtn = screen.getByRole('button');
    fireEvent.click(addBtn);

    expect(screen.getByTestId('mock-modal-editora')).toBeInTheDocument();

    const salvarBtn = screen.getByText('Salvar e Fechar');
    fireEvent.click(salvarBtn);

    await waitFor(() => {
      expect(mockObterEditoraResumido).toHaveBeenCalledTimes(2);
    });

    expect(screen.queryByTestId('mock-modal-editora')).not.toBeInTheDocument();
  });

  test('desabilita botão de adicionar quando desabilitarCampos for true ou sem permissão', async () => {
    mockObterEditoraResumido.mockResolvedValue({ sucesso: true, dados: [] });
    mockObterPermissaoPorMenu.mockReturnValueOnce({ podeIncluir: false });

    renderComponent(false);

    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });
});
