import { render, screen, fireEvent, waitFor } from '~/tests/test-utils';
import { DetalhesConsultaAcervo } from './index';
import { ROUTES } from '~/core/enum/routes';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import * as acervoService from '~/core/services/acervo-service';
import { FieldsDetalhesArtesGraficas } from './form-fields-config/artes-graficas';
import { FieldsDetalhesAudiovisual } from './form-fields-config/audiovisual';
import { FieldsDetalhesBibliografico } from './form-fields-config/bibliografico';
import { FieldsDetalhesDocumentacaoTextual } from './form-fields-config/documentacao-historica';
import { FieldsDetalhesFotografico } from './form-fields-config/fotografico';
import { FieldsDetalhesTridimensional } from './form-fields-config/tridimensional';

const mockNavigate = jest.fn();
let mockLocationState: any = null;
let mockParams: Record<string, string> = {};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: mockLocationState }),
  useParams: () => mockParams,
}));

jest.mock('~/core/services/acervo-service', () => ({
  obterDetalhamentoPorTipoAcervoECodigoAreaPublica: jest.fn(),
}));

jest.mock('../components/button-enviar-para-minha-selecao', () => ({
  ButtonEnviarParaMinhaSelecao: ({ pesquisaAcervo }: any) => (
    <button data-testid='mock-btn-enviar-selecao' data-acervoid={pesquisaAcervo?.acervoId}>
      Enviar para a minha seleção
    </button>
  ),
}));

let mockDetalhesProps: any = null;
jest.mock('./detalhes-acervo-area-publica', () => ({
  __esModule: true,
  default: (props: any) => {
    mockDetalhesProps = props;
    return (
      <div data-testid='mock-detalhes-area-publica' data-fields-count={props.fields?.length} />
    );
  },
}));

let mockGalleryProps: any = null;
jest.mock('../components/gallery', () => ({
  ImageGalleryDetalhesAcervo: (props: any) => {
    mockGalleryProps = props;
    return (
      <div
        data-testid='mock-image-gallery'
        data-padrao={props.enderecoImagemPadrao}
        data-imagens-count={props.imagens?.length || 0}
      />
    );
  },
}));

describe('DetalhesConsultaAcervo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocationState = null;
    mockParams = {};
    mockDetalhesProps = null;
    mockGalleryProps = null;
    (acervoService.obterDetalhamentoPorTipoAcervoECodigoAreaPublica as jest.Mock).mockResolvedValue(
      { sucesso: false },
    );
  });

  describe('Navegação e Botão Voltar', () => {
    test('renderiza o botão "Voltar" e navega para ROUTES.CONSULTA_ACERVO ao ser clicado', () => {
      render(<DetalhesConsultaAcervo />);

      const btnVoltar = screen.getByRole('button', { name: /voltar/i });
      expect(btnVoltar).toBeInTheDocument();

      fireEvent.click(btnVoltar);
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CONSULTA_ACERVO);
    });

    test('repassa state para ButtonEnviarParaMinhaSelecao', () => {
      mockLocationState = {
        acervoId: 99,
        codigo: 'TOMBO-99',
        tipo: TipoAcervo.Bibliografico,
      };

      render(<DetalhesConsultaAcervo />);

      const btnEnviar = screen.getByTestId('mock-btn-enviar-selecao');
      expect(btnEnviar).toBeInTheDocument();
      expect(btnEnviar).toHaveAttribute('data-acervoid', '99');
    });
  });

  describe('Parâmetros de rota (useParams)', () => {
    test('lida com paramsRoute contendo id', () => {
      mockParams = { id: '123' };
      mockLocationState = {
        codigo: 'COD-123',
        tipo: TipoAcervo.Bibliografico,
      };

      (
        acervoService.obterDetalhamentoPorTipoAcervoECodigoAreaPublica as jest.Mock
      ).mockResolvedValue({
        sucesso: true,
        dados: { titulo: 'Livro 123' },
      });

      render(<DetalhesConsultaAcervo />);

      expect(screen.getByTestId('mock-detalhes-area-publica')).toBeInTheDocument();
    });

    test('lida com paramsRoute sem id (fallback para 0)', () => {
      mockParams = {};
      render(<DetalhesConsultaAcervo />);

      expect(screen.getByTestId('mock-detalhes-area-publica')).toBeInTheDocument();
    });
  });

  describe('Definição de campos com base no tipo de acervo (obterCampos)', () => {
    const tiposEConfiguracoes = [
      { tipo: TipoAcervo.Fotografico, config: FieldsDetalhesFotografico },
      { tipo: TipoAcervo.ArtesGraficas, config: FieldsDetalhesArtesGraficas },
      { tipo: TipoAcervo.Tridimensional, config: FieldsDetalhesTridimensional },
      { tipo: TipoAcervo.Audiovisual, config: FieldsDetalhesAudiovisual },
      { tipo: TipoAcervo.DocumentacaoTextual, config: FieldsDetalhesDocumentacaoTextual },
      { tipo: TipoAcervo.Bibliografico, config: FieldsDetalhesBibliografico },
    ];

    tiposEConfiguracoes.forEach(({ tipo, config }) => {
      test(`define campos corretos para o tipo de acervo ${tipo}`, async () => {
        mockLocationState = { codigo: 'COD-1', tipo };
        (
          acervoService.obterDetalhamentoPorTipoAcervoECodigoAreaPublica as jest.Mock
        ).mockResolvedValue({ sucesso: false });

        render(<DetalhesConsultaAcervo />);

        await waitFor(() => {
          expect(mockDetalhesProps?.fields).toEqual(config);
        });
      });
    });

    test('limpa os campos quando tipoAcervoState for inexistente/falsy', async () => {
      mockLocationState = null;
      render(<DetalhesConsultaAcervo />);

      await waitFor(() => {
        expect(mockDetalhesProps?.fields).toEqual([]);
      });
    });

    test('aciona o default do switch e limpa campos para tipo de acervo não mapeado', async () => {
      mockLocationState = { codigo: 'COD-1', tipo: 999 as any };
      render(<DetalhesConsultaAcervo />);

      await waitFor(() => {
        expect(mockDetalhesProps?.fields).toEqual([]);
      });
    });
  });

  describe('Busca de dados do acervo (obterDados)', () => {
    test('carrega dados com sucesso e repassa para ImageGallery e DetalhesAreaPublica', async () => {
      const mockDadosRetorno = {
        titulo: 'Obra de Arte',
        imagens: [{ original: 'img1.jpg', thumbnail: 'thumb1.jpg' }],
        enderecoImagemPadrao: 'padrao.jpg',
      };

      mockLocationState = {
        codigo: 'TOMBO-55',
        tipo: TipoAcervo.ArtesGraficas,
      };

      (
        acervoService.obterDetalhamentoPorTipoAcervoECodigoAreaPublica as jest.Mock
      ).mockResolvedValue({
        sucesso: true,
        dados: mockDadosRetorno,
      });

      render(<DetalhesConsultaAcervo />);

      await waitFor(() => {
        expect(acervoService.obterDetalhamentoPorTipoAcervoECodigoAreaPublica).toHaveBeenCalledWith(
          'TOMBO-55',
          TipoAcervo.ArtesGraficas,
        );
        expect(mockDetalhesProps?.dados).toEqual(mockDadosRetorno);
        expect(mockGalleryProps?.imagens).toEqual(mockDadosRetorno.imagens);
        expect(mockGalleryProps?.enderecoImagemPadrao).toBe('padrao.jpg');
      });
    });

    test('define dados como undefined quando a resposta da API retornar sucesso false', async () => {
      mockLocationState = {
        codigo: 'TOMBO-55',
        tipo: TipoAcervo.ArtesGraficas,
      };

      (
        acervoService.obterDetalhamentoPorTipoAcervoECodigoAreaPublica as jest.Mock
      ).mockResolvedValue({
        sucesso: false,
      });

      render(<DetalhesConsultaAcervo />);

      await waitFor(() => {
        expect(acervoService.obterDetalhamentoPorTipoAcervoECodigoAreaPublica).toHaveBeenCalled();
        expect(mockDetalhesProps?.dados).toBeUndefined();
        expect(mockGalleryProps?.enderecoImagemPadrao).toBe('');
      });
    });

    test('não chama API se codigo ou tipo estiverem ausentes no state', () => {
      mockLocationState = { codigo: '' };

      render(<DetalhesConsultaAcervo />);

      expect(acervoService.obterDetalhamentoPorTipoAcervoECodigoAreaPublica).not.toHaveBeenCalled();
      expect(mockDetalhesProps?.dados).toBeUndefined();
    });

    test('repassa string vazia para enderecoImagemPadrao quando dados.enderecoImagemPadrao for vazio ou nulo', async () => {
      mockLocationState = {
        codigo: 'TOMBO-77',
        tipo: TipoAcervo.Bibliografico,
      };

      (
        acervoService.obterDetalhamentoPorTipoAcervoECodigoAreaPublica as jest.Mock
      ).mockResolvedValue({
        sucesso: true,
        dados: { titulo: 'Livro', enderecoImagemPadrao: '' },
      });

      render(<DetalhesConsultaAcervo />);

      await waitFor(() => {
        expect(mockGalleryProps?.enderecoImagemPadrao).toBe('');
      });
    });
  });
});
