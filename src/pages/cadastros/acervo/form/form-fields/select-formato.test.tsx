import { render, screen, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import SelectFormatoImagem from './select-formato';
import { CDEP_SELECT_ESTADO_FORMATO_IMAGEM } from '~/core/constants/ids/select';
import * as formatoService from '~/core/services/formato-service';

jest.mock('~/core/services/formato-service');

describe('SelectFormatoImagem', () => {
  const mockObterFormatosImagem = formatoService.obterFormatosImagem as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Form>
        <SelectFormatoImagem
          formItemProps={{ extra: <span data-testid='extra-formato'>Extra</span> }}
        />
      </Form>,
    );
  };

  test('carrega formatos de imagem e renderiza select com regra obrigatória', async () => {
    mockObterFormatosImagem.mockResolvedValueOnce({
      sucesso: true,
      dados: [
        { id: '1', nome: 'JPEG' },
        { id: '2', nome: 'PNG' },
      ],
    });

    const { container } = renderComponent();

    await waitFor(() => {
      expect(mockObterFormatosImagem).toHaveBeenCalledTimes(1);
    });

    expect(document.querySelector(`#${CDEP_SELECT_ESTADO_FORMATO_IMAGEM}`)).toBeInTheDocument();
    expect(screen.getByTestId('extra-formato')).toBeInTheDocument();

    const requiredItem = container.querySelector('.ant-form-item-required');
    expect(requiredItem).toBeInTheDocument();
  });

  test('trata resposta sem sucesso limpando opções', async () => {
    mockObterFormatosImagem.mockResolvedValueOnce({
      sucesso: false,
      dados: null,
    });

    renderComponent();

    await waitFor(() => {
      expect(mockObterFormatosImagem).toHaveBeenCalledTimes(1);
    });

    expect(document.querySelector(`#${CDEP_SELECT_ESTADO_FORMATO_IMAGEM}`)).toBeInTheDocument();
  });
});
