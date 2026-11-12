import { render, screen, fireEvent } from '~/tests/test-utils';
import { ListaCardsConsultaAcervo } from './index';
import { ConsultaAcervoContext } from '../provider';
import { ROUTES } from '~/core/enum/routes';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';

const mockNavigate = jest.fn();
const mockForm = {
  getFieldsValue: jest.fn(() => ({ textoLivre: 'filtro ativo' })),
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('antd/es/form/hooks/useFormInstance', () => ({
  __esModule: true,
  default: () => mockForm,
}));

jest.mock('../components/selecionar-acervo', () => {
  const MockCheckbox = ({ pesquisaAcervo }: any) => (
    <input type='checkbox' data-testid={`mock-checkbox-acervo-${pesquisaAcervo?.acervoId}`} />
  );
  return MockCheckbox;
});

describe('ListaCardsConsultaAcervo', () => {
  const mockCarregarDados = jest.fn();

  const mockItemBase: PesquisaAcervoDTO = {
    acervoId: 101,
    titulo: 'Memórias Póstumas de Brás Cubas',
    editora: 'Tipografia Nacional',
    creditoAutoria: 'Machado de Assis',
    assunto: 'Literatura Clássica',
    descricao: 'Obra realista brasileira',
    ano: '1881',
    dataAcervo: '1881-01-01',
    tipo: TipoAcervo.Bibliografico,
    enderecoImagem: 'https://exemplo.com/capa.jpg',
    enderecoImagemPadrao: 'https://exemplo.com/padrao.jpg',
    estaDisponivel: true,
    temControleDisponibilidade: true,
    situacaoDisponibilidade: 'Disponível',
  } as PesquisaAcervoDTO;

  const renderComponent = (contextOverrides: any = {}) => {
    const defaultContext = {
      dataSource: [mockItemBase],
      loading: false,
      listParams: {
        current: 1,
        pageSize: 5,
        total: 10,
        showSizeChanger: true,
      },
      carregarDados: mockCarregarDados,
      textoLivrePesquisado: '',
      ...contextOverrides,
    };

    return render(
      <ConsultaAcervoContext.Provider value={defaultContext}>
        <ListaCardsConsultaAcervo />
      </ConsultaAcervoContext.Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização dos Cards e Informações do Acervo', () => {
    test('renderiza os dados principais do card do acervo', () => {
      renderComponent();

      expect(screen.getByText('Memórias Póstumas de Brás Cubas')).toBeInTheDocument();
      expect(screen.getByText('Tipografia Nacional')).toBeInTheDocument();
      expect(screen.getByText('Machado de Assis')).toBeInTheDocument();
      expect(screen.getByText('Literatura Clássica')).toBeInTheDocument();
      expect(screen.getByText('Obra realista brasileira')).toBeInTheDocument();
      expect(screen.getByText('1881')).toBeInTheDocument();
      expect(screen.getByText('1881-01-01')).toBeInTheDocument();
      expect(screen.getByTestId('mock-checkbox-acervo-101')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /detalhes/i })).toBeInTheDocument();
    });

    test('exibe a imagem personalizada quando enderecoImagem estiver preenchido', () => {
      const { container } = renderComponent();

      const img = container.querySelector('.ant-image-img') as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://exemplo.com/capa.jpg');
      expect(img).toHaveStyle({ width: '200px' });
    });

    test('utiliza a imagem padrão quando enderecoImagem estiver vazio', () => {
      const { container } = renderComponent({
        dataSource: [
          {
            ...mockItemBase,
            acervoId: 102,
            enderecoImagem: '',
            enderecoImagemPadrao: 'https://exemplo.com/padrao.jpg',
          },
        ],
      });

      const img = container.querySelector('.ant-image-img') as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://exemplo.com/padrao.jpg');
      expect(img).toHaveStyle({ width: '100px' });
    });

    test('desabilita clique direito na imagem chamando preventDefault', () => {
      const { container } = renderComponent();

      const img = container.querySelector('.ant-image-img') as HTMLImageElement;
      const defaultPrevented = !fireEvent.contextMenu(img);

      expect(defaultPrevented).toBe(true);
    });

    test('destaca termos pesquisados quando textoLivrePesquisado for fornecido', () => {
      const { container } = renderComponent({ textoLivrePesquisado: 'Machado' });

      const markElement = container.querySelector('mark');
      expect(markElement).toBeInTheDocument();
      expect(markElement).toHaveTextContent('Machado');
    });
  });

  describe('Mapeamento dos tipos de acervo (tagAcervo e tipoAcervoNome)', () => {
    const tipos = [
      { tipo: TipoAcervo.Bibliografico, tagEsperada: 'Biblioteca', nomeEsperado: 'Bibliográfico' },
      {
        tipo: TipoAcervo.DocumentacaoTextual,
        tagEsperada: 'Memória Documental',
        nomeEsperado: 'Documentação histórica',
      },
      {
        tipo: TipoAcervo.ArtesGraficas,
        tagEsperada: 'Memorial da Educação Municipal',
        nomeEsperado: 'Artes gráficas',
      },
      {
        tipo: TipoAcervo.Audiovisual,
        tagEsperada: 'Memorial da Educação Municipal',
        nomeEsperado: 'Audiovisual',
      },
      {
        tipo: TipoAcervo.Fotografico,
        tagEsperada: 'Memorial da Educação Municipal',
        nomeEsperado: 'Fotográfico',
      },
      {
        tipo: TipoAcervo.Tridimensional,
        tagEsperada: 'Memorial da Educação Municipal',
        nomeEsperado: 'Tridimensional',
      },
    ];

    tipos.forEach(({ tipo, tagEsperada, nomeEsperado }) => {
      test(`renderiza corretamente a tag "${tagEsperada}" e o nome "${nomeEsperado}" para o tipo ${tipo}`, () => {
        renderComponent({
          dataSource: [{ ...mockItemBase, acervoId: tipo, tipo }],
        });

        expect(screen.getByText(tagEsperada)).toBeInTheDocument();
        expect(screen.getByText(nomeEsperado)).toBeInTheDocument();
      });
    });
  });

  describe('Navegação para Detalhes', () => {
    test('navega para ROUTES.CONSULTA_ACERVO_DETALHES com o item no state ao clicar em Detalhes', () => {
      renderComponent();

      const btnDetalhes = screen.getByRole('button', { name: /detalhes/i });
      fireEvent.click(btnDetalhes);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CONSULTA_ACERVO_DETALHES, {
        state: mockItemBase,
      });
    });
  });

  describe('Paginação da Lista', () => {
    test('dispara carregarDados com novos parâmetros ao mudar de página', () => {
      const { container } = renderComponent({
        listParams: {
          current: 1,
          pageSize: 5,
          total: 20,
          showSizeChanger: true,
        },
      });

      const page2 = container.querySelector('.ant-pagination-item-2');
      expect(page2).toBeInTheDocument();
      fireEvent.click(page2!);

      expect(mockForm.getFieldsValue).toHaveBeenCalled();
      expect(mockCarregarDados).toHaveBeenCalledWith(
        expect.objectContaining({
          current: 2,
          pageSize: 5,
        }),
        { textoLivre: 'filtro ativo' },
      );
    });
  });

  describe('Estados da Lista (Vazio e Loading)', () => {
    test('exibe mensagem "Sem dados" quando dataSource for vazio', () => {
      renderComponent({ dataSource: [] });

      expect(screen.getByText('Sem dados')).toBeInTheDocument();
    });

    test('lida com textoLivrePesquisado indefinido ou vazio', () => {
      renderComponent({ textoLivrePesquisado: undefined });

      expect(screen.getByText('Memórias Póstumas de Brás Cubas')).toBeInTheDocument();
    });

    test('exibe indicador de loading quando loading for true', () => {
      const { container } = renderComponent({ loading: true });

      expect(container.querySelector('.ant-spin')).toBeInTheDocument();
    });
  });
});
