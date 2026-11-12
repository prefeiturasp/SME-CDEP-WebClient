import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  ConsultaAcervoDetalhesDTO,
  FieldAcervoDetalhesProps,
} from '~/core/dto/form-cadastro-detalhes';
import { ROUTES } from '~/core/enum/routes';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { obterDetalhamentoPorTipoAcervoECodigoAreaPublica } from '~/core/services/acervo-service';
import { DetalhesConsultaAcervo } from './index';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('~/core/services/acervo-service', () => ({
  obterDetalhamentoPorTipoAcervoECodigoAreaPublica: jest.fn(),
}));

jest.mock('../components/gallery', () => ({
  ImageGalleryDetalhesAcervo: ({ enderecoImagemPadrao }: { enderecoImagemPadrao: string }) => (
    <div data-testid='mock-gallery' data-padrao={enderecoImagemPadrao} />
  ),
}));

jest.mock('../components/button-enviar-para-minha-selecao', () => ({
  ButtonEnviarParaMinhaSelecao: () => <button type='button'>Enviar para a minha seleção</button>,
}));

jest.mock('./detalhes-acervo-area-publica', () => ({
  __esModule: true,
  default: ({
    fields,
    dados,
  }: {
    fields: FieldAcervoDetalhesProps[];
    dados?: ConsultaAcervoDetalhesDTO;
  }) => (
    <div
      data-testid='mock-detalhes-area-publica'
      data-fields-count={fields.length}
      data-titulo={dados?.titulo ?? ''}
    />
  ),
}));

const mockedObterDetalhamento = obterDetalhamentoPorTipoAcervoECodigoAreaPublica as jest.Mock;

const renderDetalhes = (
  state?: Record<string, unknown>,
  initialEntry = '/consulta-acervo/detalhes/42',
) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: initialEntry, state }]}>
      <Routes>
        <Route path='/consulta-acervo/detalhes/:id' element={<DetalhesConsultaAcervo />} />
        <Route path='/consulta-acervo/detalhes' element={<DetalhesConsultaAcervo />} />
      </Routes>
    </MemoryRouter>,
  );

describe('DetalhesConsultaAcervo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('C14: sem state ou com tipo desconhecido não chama serviço e zera campos', () => {
    const { unmount } = renderDetalhes(undefined, '/consulta-acervo/detalhes');
    expect(mockedObterDetalhamento).not.toHaveBeenCalled();
    expect(screen.getByTestId('mock-detalhes-area-publica')).toHaveAttribute(
      'data-fields-count',
      '0',
    );
    unmount();

    renderDetalhes({ codigo: 'C-99', tipo: 999 });
    expect(mockedObterDetalhamento).not.toHaveBeenCalled();
    expect(screen.getByTestId('mock-detalhes-area-publica')).toHaveAttribute(
      'data-fields-count',
      '0',
    );
  });

  it.each([
    TipoAcervo.Fotografico,
    TipoAcervo.ArtesGraficas,
    TipoAcervo.Tridimensional,
    TipoAcervo.Audiovisual,
    TipoAcervo.DocumentacaoTextual,
    TipoAcervo.Bibliografico,
  ])('C15: carrega campos e dados para TipoAcervo=%s', async (tipo) => {
    mockedObterDetalhamento.mockResolvedValue({
      sucesso: true,
      dados: {
        titulo: `Título Tipo ${tipo}`,
        enderecoImagemPadrao: 'https://exemplo.com/padrao.png',
      },
    });

    renderDetalhes({ codigo: `COD-${tipo}`, tipo });

    await waitFor(() => {
      expect(mockedObterDetalhamento).toHaveBeenCalledWith(`COD-${tipo}`, tipo);
    });

    await waitFor(() => {
      expect(screen.getByTestId('mock-detalhes-area-publica')).toHaveAttribute(
        'data-titulo',
        `Título Tipo ${tipo}`,
      );
    });

    expect(screen.getByTestId('mock-gallery')).toHaveAttribute(
      'data-padrao',
      'https://exemplo.com/padrao.png',
    );
  });

  it('C16: limpa dados quando serviço retorna sucesso=false', async () => {
    mockedObterDetalhamento.mockResolvedValue({
      sucesso: false,
    });

    renderDetalhes({ codigo: 'COD-ERR', tipo: TipoAcervo.Bibliografico });

    await waitFor(() => {
      expect(mockedObterDetalhamento).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId('mock-detalhes-area-publica')).toHaveAttribute('data-titulo', '');
  });

  it('C17: navega para CONSULTA_ACERVO ao clicar em Voltar', () => {
    renderDetalhes(undefined, '/consulta-acervo/detalhes');

    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CONSULTA_ACERVO);
  });
});
