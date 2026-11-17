import { render, screen, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import SelectCromia from './select-cromia';
import { CDEP_SELECT_CROMIA } from '~/core/constants/ids/select';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import * as cromiaService from '~/core/services/cromia-service';

jest.mock('~/core/services/cromia-service');

describe('SelectCromia', () => {
  const mockObterListaCromia = cromiaService.obterListaCromia as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (tipoAcervo?: TipoAcervo) => {
    return render(
      <Form>
        <SelectCromia
          tipoAcervo={tipoAcervo}
          formItemProps={{ extra: <span data-testid='extra-cromia'>Extra</span> }}
        />
      </Form>,
    );
  };

  test('define campo como não obrigatório para tipologia Audiovisual', async () => {
    mockObterListaCromia.mockResolvedValueOnce({
      sucesso: true,
      dados: [{ id: '1', nome: 'Colorido' }],
    });

    const { container } = renderComponent(TipoAcervo.Audiovisual);

    await waitFor(() => {
      expect(mockObterListaCromia).toHaveBeenCalledTimes(1);
    });

    expect(document.querySelector(`#${CDEP_SELECT_CROMIA}`)).toBeInTheDocument();
    expect(screen.getByTestId('extra-cromia')).toBeInTheDocument();

    const requiredItem = container.querySelector('.ant-form-item-required');
    expect(requiredItem).not.toBeInTheDocument();
  });

  test('define campo como obrigatório por padrão para outras tipologias', async () => {
    mockObterListaCromia.mockResolvedValueOnce({
      sucesso: true,
      dados: [{ id: '2', nome: 'Preto e Branco' }],
    });

    const { container } = renderComponent(TipoAcervo.Fotografico);

    await waitFor(() => {
      expect(mockObterListaCromia).toHaveBeenCalledTimes(1);
    });

    const requiredItem = container.querySelector('.ant-form-item-required');
    expect(requiredItem).toBeInTheDocument();
  });

  test('trata retorno de insucesso limpando opções', async () => {
    mockObterListaCromia.mockResolvedValueOnce({
      sucesso: false,
      dados: null,
    });

    renderComponent(TipoAcervo.Fotografico);

    await waitFor(() => {
      expect(mockObterListaCromia).toHaveBeenCalledTimes(1);
    });

    expect(document.querySelector(`#${CDEP_SELECT_CROMIA}`)).toBeInTheDocument();
  });
});
