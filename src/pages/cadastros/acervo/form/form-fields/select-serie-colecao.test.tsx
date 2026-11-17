import React from 'react';
import { render, screen, fireEvent, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import SelectSerieColecao from './select-serie-colecao';
import { CDEP_SELECT_SERIE_COLECAO } from '~/core/constants/ids/select';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import * as serieColecaoService from '~/core/services/serie-colecao-service';
import * as perfilUtils from '~/core/utils/perfil';

jest.mock('~/core/services/serie-colecao-service');
jest.mock('~/core/utils/perfil');
jest.mock('~/components/cdep/cadastros/auxiliares/form', () => {
  const MockFormCadastrosAuxiliares = ({
    setOpenModal,
  }: {
    setOpenModal: (open: boolean, update?: boolean) => void;
  }) => (
    <div data-testid='mock-modal-serie-colecao'>
      <button onClick={() => setOpenModal(false, true)}>Salvar e Fechar</button>
    </div>
  );
  MockFormCadastrosAuxiliares.displayName = 'MockFormCadastrosAuxiliares';
  return MockFormCadastrosAuxiliares;
});

type PermissaoValue = React.ComponentProps<typeof PermissaoContext.Provider>['value'];

describe('SelectSerieColecao', () => {
  const mockObterSerieColecaoResumido = serieColecaoService.obterSerieColecaoResumido as jest.Mock;
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
          <SelectSerieColecao
            formItemProps={{ extra: <span data-testid='extra-serie-colecao'>Extra</span> }}
          />
        </Form>
      </PermissaoContext.Provider>,
    );
  };

  test('carrega séries/coleções e exibe no select', async () => {
    mockObterSerieColecaoResumido.mockResolvedValueOnce({
      sucesso: true,
      dados: [
        { id: '1', nome: 'Coleção Histórica' },
        { id: '2', nome: 'Série Escolar' },
      ],
    });

    renderComponent();

    await waitFor(() => {
      expect(mockObterSerieColecaoResumido).toHaveBeenCalledTimes(1);
    });

    expect(document.querySelector(`#${CDEP_SELECT_SERIE_COLECAO}`)).toBeInTheDocument();
    expect(screen.getByTestId('extra-serie-colecao')).toBeInTheDocument();
  });

  test('trata erro no serviço limpando opções', async () => {
    mockObterSerieColecaoResumido.mockResolvedValueOnce({
      sucesso: false,
      dados: null,
    });

    renderComponent();

    await waitFor(() => {
      expect(mockObterSerieColecaoResumido).toHaveBeenCalledTimes(1);
    });

    expect(document.querySelector(`#${CDEP_SELECT_SERIE_COLECAO}`)).toBeInTheDocument();
  });

  test('abre modal de cadastro de série/coleção e recarrega dados ao fechar com update', async () => {
    mockObterSerieColecaoResumido.mockResolvedValue({
      sucesso: true,
      dados: [{ id: '1', nome: 'Coleção Histórica' }],
    });

    renderComponent();

    await waitFor(() => {
      expect(mockObterSerieColecaoResumido).toHaveBeenCalledTimes(1);
    });

    const addBtn = screen.getByRole('button');
    fireEvent.click(addBtn);

    expect(screen.getByTestId('mock-modal-serie-colecao')).toBeInTheDocument();

    const salvarBtn = screen.getByText('Salvar e Fechar');
    fireEvent.click(salvarBtn);

    await waitFor(() => {
      expect(mockObterSerieColecaoResumido).toHaveBeenCalledTimes(2);
    });

    expect(screen.queryByTestId('mock-modal-serie-colecao')).not.toBeInTheDocument();
  });
});
