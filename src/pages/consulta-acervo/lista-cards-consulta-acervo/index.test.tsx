import { fireEvent, render, screen } from '@testing-library/react';
import { Form, FormInstance } from 'antd';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { ROUTES } from '~/core/enum/routes';
import { TipoAcervo, TipoAcervoDisplay } from '~/core/enum/tipo-acervo';
import { TipoAcervoTag, TipoAcervoTagDisplay } from '~/core/enum/tipo-acervo-tag';
import { ConsultaAcervoContext } from '../provider';
import { ListaCardsConsultaAcervo } from './index';

const mockNavigate = jest.fn();
let mockActiveForm: FormInstance | undefined;

jest.mock('antd/es/form/hooks/useFormInstance', () => ({
  __esModule: true,
  default: () => mockActiveForm,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../components/selecionar-acervo', () => ({
  __esModule: true,
  default: ({ pesquisaAcervo }: { pesquisaAcervo: PesquisaAcervoDTO }) => (
    <div data-testid={`checkbox-${pesquisaAcervo.titulo}`} />
  ),
}));

jest.mock('../components/text-content-card', () => ({
  TextItemCardContentConsultaAcervo: ({
    label,
    description,
    termoPesquisado,
  }: {
    label: string;
    description?: string | number;
    termoPesquisado?: string[];
  }) => (
    <div data-testid='text-item' data-termo={(termoPesquisado || []).join(',')}>
      <span>{label}</span>
      <span>{description}</span>
    </div>
  ),
}));

const criarItem = (id: number, tipo: TipoAcervo, comImagem = true): PesquisaAcervoDTO =>
  ({
    id,
    tipo,
    titulo: `Título ${id}`,
    editora: `Editora ${id}`,
    creditoAutoria: `Autor ${id}`,
    assunto: `Assunto ${id}`,
    descricao: `Descrição ${id}`,
    ano: '2020',
    dataAcervo: '2020-01-01',
    enderecoImagem: comImagem ? `https://exemplo.com/img-${id}.png` : undefined,
    enderecoImagemPadrao: `https://exemplo.com/padrao-${id}.png`,
  } as unknown as PesquisaAcervoDTO);

const renderLista = (options?: {
  dataSource?: PesquisaAcervoDTO[];
  loading?: boolean;
  textoLivrePesquisado?: string;
  total?: number;
  pageSize?: number;
  carregarDados?: jest.Mock;
}) => {
  const carregarDados = options?.carregarDados ?? jest.fn();

  const Wrapper: React.FC = () => {
    const [form] = Form.useForm();
    mockActiveForm = form;
    return (
      <MemoryRouter>
        <ConsultaAcervoContext.Provider
          value={{
            dataSource: options?.dataSource ?? [],
            loading: options?.loading ?? false,
            listParams: {
              current: 1,
              pageSize: options?.pageSize ?? 5,
              total: options?.total ?? (options?.dataSource?.length || 0),
              hideOnSinglePage: false,
            },
            carregarDados,
            onClickBuscar: jest.fn(),
            limparDados: jest.fn(),
            textoLivrePesquisado: options?.textoLivrePesquisado,
          }}
        >
          <Form
            form={form}
            initialValues={{ textoLivre: 'busca', tipoAcervo: TipoAcervo.Bibliografico }}
          >
            <Form.Item name='textoLivre'>
              <input aria-label='textoLivre' />
            </Form.Item>
            <Form.Item name='tipoAcervo'>
              <input aria-label='tipoAcervo' />
            </Form.Item>
            <ListaCardsConsultaAcervo />
          </Form>
        </ConsultaAcervoContext.Provider>
      </MemoryRouter>
    );
  };

  return {
    ...render(<Wrapper />),
    carregarDados,
  };
};

describe('ListaCardsConsultaAcervo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('C11: exibe estado vazio "Sem dados" quando dataSource está vazio', () => {
    renderLista({ dataSource: [] });

    expect(screen.getByText('Sem dados')).toBeInTheDocument();
  });

  it('C12: renderiza todos os 6 tipos de acervo com tags, imagens e termo pesquisado', () => {
    const items = [
      criarItem(1, TipoAcervo.Bibliografico, true),
      criarItem(2, TipoAcervo.DocumentacaoTextual, false),
      criarItem(3, TipoAcervo.ArtesGraficas, true),
      criarItem(4, TipoAcervo.Audiovisual, true),
      criarItem(5, TipoAcervo.Fotografico, true),
      criarItem(6, TipoAcervo.Tridimensional, true),
    ];

    renderLista({
      dataSource: items,
      textoLivrePesquisado: 'escola',
      total: 12,
      pageSize: 10,
    });

    expect(screen.getByText(TipoAcervoDisplay[TipoAcervo.Bibliografico])).toBeInTheDocument();
    expect(screen.getByText(TipoAcervoDisplay[TipoAcervo.DocumentacaoTextual])).toBeInTheDocument();
    expect(screen.getByText(TipoAcervoDisplay[TipoAcervo.ArtesGraficas])).toBeInTheDocument();
    expect(screen.getByText(TipoAcervoDisplay[TipoAcervo.Audiovisual])).toBeInTheDocument();
    expect(screen.getByText(TipoAcervoDisplay[TipoAcervo.Fotografico])).toBeInTheDocument();
    expect(screen.getByText(TipoAcervoDisplay[TipoAcervo.Tridimensional])).toBeInTheDocument();

    expect(screen.getByText(TipoAcervoTagDisplay[TipoAcervoTag.Biblioteca])).toBeInTheDocument();
    expect(
      screen.getByText(TipoAcervoTagDisplay[TipoAcervoTag.MemoriaDocumental]),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(TipoAcervoTagDisplay[TipoAcervoTag.MemoriaEducacaoMunicipal]),
    ).toHaveLength(4);

    const imgs = screen.getAllByAltText('example') as HTMLImageElement[];
    expect(imgs[0].src).toContain('img-1.png');
    expect(imgs[1].src).toContain('padrao-2.png');

    const textItems = screen.getAllByTestId('text-item');
    expect(textItems[0]).toHaveAttribute('data-termo', 'escola');
  });

  it('C13: previne menu de contexto ao clicar com o botão direito na imagem', () => {
    renderLista({ dataSource: [criarItem(10, TipoAcervo.Bibliografico, true)] });

    const img = screen.getByAltText('example');
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    fireEvent(img, event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('C14: navega para detalhes passando o item no state ao clicar em "Detalhes"', () => {
    const item = criarItem(11, TipoAcervo.Bibliografico, true);
    renderLista({ dataSource: [item] });

    fireEvent.click(screen.getByRole('button', { name: 'Detalhes' }));

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CONSULTA_ACERVO_DETALHES, {
      state: item,
    });
  });

  it('C15: ao mudar paginação, chama carregarDados com nova página e filtros do formulário', () => {
    const items = Array.from({ length: 6 }, (_, idx) =>
      criarItem(idx + 1, TipoAcervo.Bibliografico, true),
    );
    const { carregarDados } = renderLista({
      dataSource: items,
      total: 12,
    });

    const page2Item = screen.getByTitle('2');
    fireEvent.click(page2Item);

    expect(carregarDados).toHaveBeenCalledWith(
      expect.objectContaining({
        current: 2,
        pageSize: 5,
      }),
      {
        textoLivre: 'busca',
        tipoAcervo: TipoAcervo.Bibliografico,
      },
    );
  });
});
