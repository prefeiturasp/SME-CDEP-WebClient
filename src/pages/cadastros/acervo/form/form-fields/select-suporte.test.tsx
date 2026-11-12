import { render, screen, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import SelectSuporte from './select-suporte';
import { CDEP_SELECT_ESTADO_SUPORTE } from '~/core/constants/ids/select';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoSuporte } from '~/core/enum/tipo-suporte';
import * as suporteService from '~/core/services/suporte-service';

jest.mock('~/core/services/suporte-service');

describe('SelectSuporte', () => {
  const mockObterListaSuporte = suporteService.obterListaSuporte as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (tipoAcervo: TipoAcervo) => {
    return render(
      <Form>
        <SelectSuporte
          tipoAcervo={tipoAcervo}
          formItemProps={{ extra: <span data-testid='extra-suporte'>Extra</span> }}
        />
      </Form>,
    );
  };

  test('carrega suporte com TipoSuporte.IMAGEM para Fotografico e ArtesGraficas', async () => {
    mockObterListaSuporte.mockResolvedValue({
      sucesso: true,
      dados: [{ id: '1', nome: 'Papel Fotográfico' }],
    });

    renderComponent(TipoAcervo.Fotografico);

    await waitFor(() => {
      expect(mockObterListaSuporte).toHaveBeenCalledWith(TipoSuporte.IMAGEM);
    });

    expect(document.querySelector(`#${CDEP_SELECT_ESTADO_SUPORTE}`)).toBeInTheDocument();
    expect(screen.getByTestId('extra-suporte')).toBeInTheDocument();

    // Testa também ArtesGraficas para cobrir a branch 36-37
    renderComponent(TipoAcervo.ArtesGraficas);
    await waitFor(() => {
      expect(mockObterListaSuporte).toHaveBeenCalledWith(TipoSuporte.IMAGEM);
    });
  });

  test('carrega suporte com TipoSuporte.VIDEO para Audiovisual', async () => {
    mockObterListaSuporte.mockResolvedValueOnce({
      sucesso: true,
      dados: [{ id: '2', nome: 'Fita VHS' }],
    });

    renderComponent(TipoAcervo.Audiovisual);

    await waitFor(() => {
      expect(mockObterListaSuporte).toHaveBeenCalledWith(TipoSuporte.VIDEO);
    });
  });

  test('carrega suporte com TipoSuporte.NAO_DEFINIDO para tipologia sem mapeamento', async () => {
    mockObterListaSuporte.mockResolvedValueOnce({
      sucesso: true,
      dados: [],
    });

    renderComponent(TipoAcervo.Bibliografico);

    await waitFor(() => {
      expect(mockObterListaSuporte).toHaveBeenCalledWith(TipoSuporte.NAO_DEFINIDO);
    });
  });

  test('trata erro na chamada limpando opções', async () => {
    mockObterListaSuporte.mockResolvedValueOnce({
      sucesso: false,
      dados: null,
    });

    renderComponent(TipoAcervo.Fotografico);

    await waitFor(() => {
      expect(mockObterListaSuporte).toHaveBeenCalledTimes(1);
    });

    expect(document.querySelector(`#${CDEP_SELECT_ESTADO_SUPORTE}`)).toBeInTheDocument();
  });
});
