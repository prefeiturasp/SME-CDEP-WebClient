import { render, screen, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import SelectConservacao from './select-estado-conservacao';
import { CDEP_SELECT_ESTADO_CONSERVACAO } from '~/core/constants/ids/select';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import * as conservacaoService from '~/core/services/conservacao-service';

jest.mock('~/core/services/conservacao-service');

describe('SelectConservacao', () => {
  const mockObterConservacoes = conservacaoService.obterConservacoes as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (tipoAcervo?: TipoAcervo) => {
    return render(
      <Form>
        <SelectConservacao
          tipoAcervo={tipoAcervo}
          formItemProps={{ extra: <span data-testid='extra-conservacao'>Extra</span> }}
        />
      </Form>,
    );
  };

  test('define campo como não obrigatório para Audiovisual e DocumentacaoTextual', async () => {
    mockObterConservacoes.mockResolvedValueOnce({
      sucesso: true,
      dados: [{ id: '1', nome: 'Bom' }],
    });

    const { container } = renderComponent(TipoAcervo.Audiovisual);

    await waitFor(() => {
      expect(mockObterConservacoes).toHaveBeenCalledTimes(1);
    });

    expect(document.querySelector(`#${CDEP_SELECT_ESTADO_CONSERVACAO}`)).toBeInTheDocument();
    expect(screen.getByTestId('extra-conservacao')).toBeInTheDocument();

    const requiredItem = container.querySelector('.ant-form-item-required');
    expect(requiredItem).not.toBeInTheDocument();
  });

  test('define campo como obrigatório por padrão para outras tipologias', async () => {
    mockObterConservacoes.mockResolvedValueOnce({
      sucesso: true,
      dados: [{ id: '1', nome: 'Regular' }],
    });

    const { container } = renderComponent(TipoAcervo.Tridimensional);

    await waitFor(() => {
      expect(mockObterConservacoes).toHaveBeenCalledTimes(1);
    });

    const requiredItem = container.querySelector('.ant-form-item-required');
    expect(requiredItem).toBeInTheDocument();
  });

  test('trata retorno de insucesso limpando opções', async () => {
    mockObterConservacoes.mockResolvedValueOnce({
      sucesso: false,
      dados: null,
    });

    renderComponent(TipoAcervo.Tridimensional);

    await waitFor(() => {
      expect(mockObterConservacoes).toHaveBeenCalledTimes(1);
    });

    expect(document.querySelector(`#${CDEP_SELECT_ESTADO_CONSERVACAO}`)).toBeInTheDocument();
  });
});
