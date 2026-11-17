import React from 'react';
import { render, screen, fireEvent, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import SelectAssunto from './select-assunto';
import { CDEP_SELECT_ASSUNTO } from '~/core/constants/ids/select';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import * as assuntoService from '~/core/services/assunto-service';
import * as perfilUtils from '~/core/utils/perfil';

jest.mock('~/core/services/assunto-service');
jest.mock('~/core/utils/perfil');
jest.mock('~/components/cdep/cadastros/auxiliares/form', () => {
  const MockFormCadastrosAuxiliares = ({
    setOpenModal,
  }: {
    setOpenModal: (open: boolean, update?: boolean) => void;
  }) => (
    <div data-testid='mock-modal-assunto'>
      <button onClick={() => setOpenModal(false, true)}>Salvar e Fechar</button>
    </div>
  );
  MockFormCadastrosAuxiliares.displayName = 'MockFormCadastrosAuxiliares';
  return MockFormCadastrosAuxiliares;
});

type PermissaoValue = React.ComponentProps<typeof PermissaoContext.Provider>['value'];

describe('SelectAssunto', () => {
  const mockObterAssuntoResumido = assuntoService.obterAssuntoResumido as jest.Mock;
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

  const renderComponent = (tipoAcervo: TipoAcervo, desabilitarCampos = false) => {
    const permissaoValue: PermissaoValue = {
      desabilitarCampos,
      setDesabilitarCampos: jest.fn(),
      permissao: {} as any,
    };

    return render(
      <PermissaoContext.Provider value={permissaoValue}>
        <Form>
          <SelectAssunto
            tipoAcervo={tipoAcervo}
            formItemProps={{ extra: <span data-testid='extra-assunto'>Extra</span> }}
          />
        </Form>
      </PermissaoContext.Provider>,
    );
  };

  test('define campo como obrigatório para Bibliografico', async () => {
    mockObterAssuntoResumido.mockResolvedValueOnce({
      sucesso: true,
      dados: [{ id: '1', nome: 'História do Brasil' }],
    });

    const { container } = renderComponent(TipoAcervo.Bibliografico);

    await waitFor(() => {
      expect(mockObterAssuntoResumido).toHaveBeenCalledTimes(1);
    });

    expect(document.querySelector(`#${CDEP_SELECT_ASSUNTO}`)).toBeInTheDocument();
    expect(screen.getByTestId('extra-assunto')).toBeInTheDocument();

    const requiredItem = container.querySelector('.ant-form-item-required');
    expect(requiredItem).toBeInTheDocument();
  });

  test('define campo como opcional para Audiovisual', async () => {
    mockObterAssuntoResumido.mockResolvedValueOnce({
      sucesso: true,
      dados: [{ id: '1', nome: 'Educação' }],
    });

    const { container } = renderComponent(TipoAcervo.Audiovisual);

    await waitFor(() => {
      expect(mockObterAssuntoResumido).toHaveBeenCalledTimes(1);
    });

    const requiredItem = container.querySelector('.ant-form-item-required');
    expect(requiredItem).not.toBeInTheDocument();
  });

  test('abre modal de cadastro auxiliar de assunto e recarrega dados ao fechar com update', async () => {
    mockObterAssuntoResumido.mockResolvedValue({
      sucesso: true,
      dados: [{ id: '1', nome: 'Ciências' }],
    });

    renderComponent(TipoAcervo.Bibliografico);

    await waitFor(() => {
      expect(mockObterAssuntoResumido).toHaveBeenCalledTimes(1);
    });

    const addBtn = screen.getByRole('button');
    fireEvent.click(addBtn);

    expect(screen.getByTestId('mock-modal-assunto')).toBeInTheDocument();

    const salvarBtn = screen.getByText('Salvar e Fechar');
    fireEvent.click(salvarBtn);

    await waitFor(() => {
      expect(mockObterAssuntoResumido).toHaveBeenCalledTimes(2);
    });

    expect(screen.queryByTestId('mock-modal-assunto')).not.toBeInTheDocument();
  });
});
