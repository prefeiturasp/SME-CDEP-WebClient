import React from 'react';
import { render, screen, fireEvent, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import SelectMaterial from './select-material';
import { CDEP_SELECT_MATERIAL } from '~/core/constants/ids/select';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoMaterial } from '~/core/enum/tipo-material-enum';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import * as materialService from '~/core/services/material-service';
import * as perfilUtils from '~/core/utils/perfil';

jest.mock('~/core/services/material-service');
jest.mock('~/core/utils/perfil');
jest.mock('~/components/cdep/cadastros/auxiliares/form', () => {
  const MockFormCadastrosAuxiliares = ({
    setOpenModal,
  }: {
    setOpenModal: (open: boolean, update?: boolean) => void;
  }) => (
    <div data-testid='mock-modal-material'>
      <button onClick={() => setOpenModal(false, true)}>Salvar e Fechar</button>
    </div>
  );
  MockFormCadastrosAuxiliares.displayName = 'MockFormCadastrosAuxiliares';
  return MockFormCadastrosAuxiliares;
});

type PermissaoValue = React.ComponentProps<typeof PermissaoContext.Provider>['value'];

describe('SelectMaterial', () => {
  const mockObterMaterial = materialService.obterMaterial as jest.Mock;
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
          <SelectMaterial
            tipoAcervo={tipoAcervo}
            formItemProps={{ extra: <span data-testid='extra-material'>Extra</span> }}
          />
        </Form>
      </PermissaoContext.Provider>,
    );
  };

  test('carrega materiais para Bibliografico com TipoMaterial.BIBLIOGRAFICO e não exibe botão adicionar', async () => {
    mockObterMaterial.mockResolvedValueOnce({
      sucesso: true,
      dados: [{ id: '1', nome: 'Papel' }],
    });

    renderComponent(TipoAcervo.Bibliografico);

    await waitFor(() => {
      expect(mockObterMaterial).toHaveBeenCalledWith(TipoMaterial.BIBLIOGRAFICO);
    });

    expect(document.querySelector(`#${CDEP_SELECT_MATERIAL}`)).toBeInTheDocument();
    expect(screen.getByTestId('extra-material')).toBeInTheDocument();

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('carrega materiais para DocumentacaoTextual com TipoMaterial.DOCUMENTAL', async () => {
    mockObterMaterial.mockResolvedValueOnce({
      sucesso: true,
      dados: [{ id: '2', nome: 'Pergaminho' }],
    });

    renderComponent(TipoAcervo.DocumentacaoTextual);

    await waitFor(() => {
      expect(mockObterMaterial).toHaveBeenCalledWith(TipoMaterial.DOCUMENTAL);
    });
  });

  test('carrega materiais para outra tipologia com TipoMaterial padrão', async () => {
    mockObterMaterial.mockResolvedValueOnce({
      sucesso: true,
      dados: [{ id: '3', nome: 'Madeira' }],
    });

    renderComponent(TipoAcervo.Tridimensional);

    await waitFor(() => {
      expect(mockObterMaterial).toHaveBeenCalledWith(TipoMaterial.NAO_DEFINIDO);
    });
  });

  test('trata resposta de erro limpando opções', async () => {
    mockObterMaterial.mockResolvedValueOnce({
      sucesso: false,
      dados: null,
    });

    renderComponent(TipoAcervo.Tridimensional);

    await waitFor(() => {
      expect(mockObterMaterial).toHaveBeenCalledTimes(1);
    });

    expect(document.querySelector(`#${CDEP_SELECT_MATERIAL}`)).toBeInTheDocument();
  });

  test('abre modal de cadastro auxiliar e recarrega dados ao fechar com update', async () => {
    mockObterMaterial.mockResolvedValue({
      sucesso: true,
      dados: [{ id: '1', nome: 'Papel' }],
    });

    renderComponent(TipoAcervo.Tridimensional);

    await waitFor(() => {
      expect(mockObterMaterial).toHaveBeenCalledTimes(1);
    });

    const addBtn = screen.getByRole('button');
    fireEvent.click(addBtn);

    expect(screen.getByTestId('mock-modal-material')).toBeInTheDocument();

    const salvarBtn = screen.getByText('Salvar e Fechar');
    fireEvent.click(salvarBtn);

    await waitFor(() => {
      expect(mockObterMaterial).toHaveBeenCalledTimes(2);
    });

    expect(screen.queryByTestId('mock-modal-material')).not.toBeInTheDocument();
  });
});
