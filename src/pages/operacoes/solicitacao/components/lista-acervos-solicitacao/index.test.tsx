import { AnyAction, configureStore, Reducer } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosResponse } from 'axios';
import { Provider } from 'react-redux';
import { notification } from '~/components/lib/notification';
import {
  CDEP_BUTTON_EXPANDIR_LINHA,
  CDEP_BUTTON_REMOVER_ACERVO,
} from '~/core/constants/ids/button/intex';
import { AcervoSolicitacaoItemRetornoCadastroDTO } from '~/core/dto/acervo-solicitacao-item-retorno-cadastro-dto';
import { ROUTES } from '~/core/enum/routes';
import { SituacaoSolicitacaoItemEnum } from '~/core/enum/situacao-item-atendimento-enum';
import { TipoAcervo, TipoAcervoDisplay } from '~/core/enum/tipo-acervo';
import solicitacaoReducer from '~/core/redux/modules/solicitacao/reducers';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import armazenamentoService from '~/core/services/armazenamento-service';
import { downloadBlob } from '~/core/utils/functions';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import AcervoSolicitacaoContextProvider, { AcervoSolicitacaoContext } from '../../provider';
import ListaAcervosSolicitacao from './index';

const mockNavigate = jest.fn();
const mockUseParams = jest.fn(() => ({} as { id?: string }));
const mockUseLocation = jest.fn(
  () => ({ state: undefined } as { state?: { validarSeTemAnexos?: boolean } }),
);

jest.mock('antd/es/table', () => jest.requireActual('antd/lib/table'));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  useLocation: () => mockUseLocation(),
}));

jest.mock('~/core/services/acervo-solicitacao-service', () => ({
  __esModule: true,
  default: {
    obterItensDoAcervoPorFiltros: jest.fn(),
    obterMinhaSolicitacaoPorId: jest.fn(),
    alterarDataVisitaDoItemAtendimento: jest.fn(),
    cancelarItemAtendimento: jest.fn(),
  },
}));

jest.mock('~/core/services/armazenamento-service', () => ({
  __esModule: true,
  default: {
    obterArquivoParaDownload: jest.fn(),
  },
}));

jest.mock('~/core/utils/functions', () => ({
  ...jest.requireActual('~/core/utils/functions'),
  downloadBlob: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
  },
}));

const mockedObterPorFiltros =
  acervoSolicitacaoService.obterItensDoAcervoPorFiltros as jest.MockedFunction<
    typeof acervoSolicitacaoService.obterItensDoAcervoPorFiltros
  >;
const mockedObterPorId = acervoSolicitacaoService.obterMinhaSolicitacaoPorId as jest.MockedFunction<
  typeof acervoSolicitacaoService.obterMinhaSolicitacaoPorId
>;
const mockedAlterarDataVisita =
  acervoSolicitacaoService.alterarDataVisitaDoItemAtendimento as jest.MockedFunction<
    typeof acervoSolicitacaoService.alterarDataVisitaDoItemAtendimento
  >;
const mockedCancelarItem = acervoSolicitacaoService.cancelarItemAtendimento as jest.MockedFunction<
  typeof acervoSolicitacaoService.cancelarItemAtendimento
>;
const mockedObterArquivoDownload =
  armazenamentoService.obterArquivoParaDownload as jest.MockedFunction<
    typeof armazenamentoService.obterArquivoParaDownload
  >;
const mockedDownloadBlob = downloadBlob as jest.MockedFunction<typeof downloadBlob>;

type ItemSolicitacaoTestDTO = AcervoSolicitacaoItemRetornoCadastroDTO & {
  tipoAtendimento?: string;
  dataVisita?: string;
};

const baseItem: ItemSolicitacaoTestDTO = {
  id: 10,
  acervoId: 100,
  tipoAcervoId: TipoAcervo.Bibliografico,
  tipoAcervo: TipoAcervoDisplay[TipoAcervo.Bibliografico],
  titulo: 'Livro Histórico SP',
  autoresCreditos: ['Machado de Assis', 'Editora CDEP'],
  situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO,
  situacao: 'Aguardando atendimento',
  tipoAtendimento: 'Empréstimo',
  estaDisponivel: true,
  temControleDisponibilidade: true,
  situacaoDisponibilidade: 'Disponível',
  arquivos: [],
  dataVisita: '',
  alteraDataVisita: false,
};

const renderWithProviders = ({
  acervosSelecionados = [],
  podeIncluir = true,
  somenteConsulta = false,
  initialDataSource,
}: {
  acervosSelecionados?: number[];
  podeIncluir?: boolean;
  somenteConsulta?: boolean;
  initialDataSource?: AcervoSolicitacaoItemRetornoCadastroDTO[];
} = {}) => {
  const store = configureStore({
    reducer: {
      solicitacao: solicitacaoReducer as unknown as Reducer<
        { acervosSelecionados: number[] },
        AnyAction
      >,
    },
    preloadedState: {
      solicitacao: {
        acervosSelecionados,
      },
    },
  });

  const setDataSourceSpy = jest.fn();
  const setPodeCancelarSpy = jest.fn();

  const content = initialDataSource ? (
    <AcervoSolicitacaoContext.Provider
      value={{
        dataSource: initialDataSource,
        setDataSource: setDataSourceSpy,
        podeCancelarSolicitacao: false,
        setPodeCancelarSolicitacao: setPodeCancelarSpy,
      }}
    >
      <ListaAcervosSolicitacao />
    </AcervoSolicitacaoContext.Provider>
  ) : (
    <AcervoSolicitacaoContextProvider>
      <ListaAcervosSolicitacao />
    </AcervoSolicitacaoContextProvider>
  );

  const utils = render(
    <Provider store={store}>
      <PermissaoContext.Provider
        value={{
          desabilitarCampos: false,
          setDesabilitarCampos: jest.fn(),
          permissao: {
            customRoles: [],
            podeAlterar: true,
            podeConsultar: true,
            podeExcluir: true,
            podeIncluir,
            somenteConsulta,
          },
        }}
      >
        {content}
      </PermissaoContext.Provider>
    </Provider>,
  );

  return {
    ...utils,
    store,
    setDataSourceSpy,
    setPodeCancelarSpy,
  };
};

describe('ListaAcervosSolicitacao', () => {
  jest.setTimeout(45000);

  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseParams.mockReturnValue({});
    mockUseLocation.mockReturnValue({ state: undefined });
    mockedObterPorFiltros.mockReset();
    mockedObterPorFiltros.mockResolvedValue({
      sucesso: true,
      dados: [],
      mensagens: [],
    });
    mockedObterPorId.mockReset();
    mockedAlterarDataVisita.mockReset();
    mockedCancelarItem.mockReset();
    mockedObterArquivoDownload.mockReset();
    mockedDownloadBlob.mockReset();
    (notification.success as jest.Mock).mockReset();
  });

  it('C20: em nova solicitação com acervosSelecionados, deve buscar obterItensDoAcervoPorFiltros e popular dataSource (sucesso e erro)', async () => {
    mockedObterPorFiltros.mockResolvedValueOnce({
      sucesso: true,
      dados: [baseItem],
      mensagens: [],
    });

    const { unmount } = renderWithProviders({ acervosSelecionados: [100] });

    await waitFor(() => {
      expect(mockedObterPorFiltros).toHaveBeenCalledWith([100]);
      expect(screen.getByText('Livro Histórico SP')).toBeInTheDocument();
    });

    unmount();

    // Fluxo quando obterItensDoAcervoPorFiltros retorna sucesso = false
    mockedObterPorFiltros.mockResolvedValueOnce({
      sucesso: false,
      dados: [],
      mensagens: ['Erro'],
    });

    renderWithProviders({ acervosSelecionados: [100] });

    await waitFor(() => {
      expect(mockedObterPorFiltros).toHaveBeenCalledWith([100]);
      expect(screen.getByText('Sem dados')).toBeInTheDocument();
    });
  });

  it('C21: botão "Adicionar acervos" deve navegar para ROUTES.CONSULTA_ACERVO quando habilitado e ficar desabilitado sem permissão ou com solicitacaoId', () => {
    const { unmount } = renderWithProviders({ podeIncluir: true });
    const btnAdicionar = screen.getByRole('button', { name: /adicionar acervos/i });
    expect(btnAdicionar).not.toBeDisabled();

    fireEvent.click(btnAdicionar);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CONSULTA_ACERVO);
    unmount();

    const { unmount: unmountSemPermissao } = renderWithProviders({ podeIncluir: false });
    expect(screen.getByRole('button', { name: /adicionar acervos/i })).toBeDisabled();
    unmountSemPermissao();

    mockUseParams.mockReturnValue({ id: '15' });
    mockedObterPorId.mockResolvedValueOnce({
      sucesso: false,
      dados: null as never,
      mensagens: [],
    });
    renderWithProviders({ podeIncluir: true });
    expect(screen.getByRole('button', { name: /adicionar acervos/i })).toBeDisabled();
  });

  it('C22: deve renderizar coluna Disponibilidade (disponível, indisponível e item não-bibliográfico) e Autor/Crédito (com tags e vazio)', () => {
    const itens: AcervoSolicitacaoItemRetornoCadastroDTO[] = [
      baseItem,
      {
        ...baseItem,
        id: 11,
        acervoId: 101,
        titulo: 'Livro Emprestado SP',
        autoresCreditos: [],
        estaDisponivel: false,
        situacaoDisponibilidade: 'Emprestado',
      },
      {
        ...baseItem,
        id: 12,
        acervoId: 102,
        tipoAcervoId: TipoAcervo.Fotografico,
        tipoAcervo: TipoAcervoDisplay[TipoAcervo.Fotografico],
        titulo: 'Fotografia Antiga',
        autoresCreditos: ['Fotógrafo X'],
      },
    ];

    renderWithProviders({ initialDataSource: itens });

    expect(screen.getByText('Disponibilidade')).toBeInTheDocument();
    expect(screen.getByText('Disponível')).toBeInTheDocument();
    expect(screen.getByText('Emprestado')).toBeInTheDocument();
    expect(screen.getByText('Machado de Assis')).toBeInTheDocument();
    expect(screen.getByText('Editora CDEP')).toBeInTheDocument();
    expect(screen.getByText('Fotógrafo X')).toBeInTheDocument();
  });

  it('C23: deve renderizar coluna Anexo para linha sem anexo, com 1 arquivo válido (download), com 1 arquivo sem código e com múltiplos arquivos (expandir/recolher)', async () => {
    const fakeBlob = new Blob(['conteudo pdf'], { type: 'application/pdf' });
    mockedObterArquivoDownload.mockResolvedValue({
      data: fakeBlob,
    } as AxiosResponse<Blob>);

    const itensComAnexos: AcervoSolicitacaoItemRetornoCadastroDTO[] = [
      {
        ...baseItem,
        id: 21,
        acervoId: 201,
        tipoAcervo: TipoAcervoDisplay[TipoAcervo.Fotografico],
        titulo: 'Item Sem Anexo',
        arquivos: [],
      },
      {
        ...baseItem,
        id: 22,
        acervoId: 202,
        tipoAcervo: TipoAcervoDisplay[TipoAcervo.Fotografico],
        titulo: 'Item Com 1 Anexo Válido',
        arquivos: [{ codigo: 'cod-unico-1', nome: 'documento-unico.pdf' }],
      },
      {
        ...baseItem,
        id: 23,
        acervoId: 203,
        tipoAcervo: TipoAcervoDisplay[TipoAcervo.Fotografico],
        titulo: 'Item Com 1 Anexo Sem Código',
        arquivos: [{ codigo: '', nome: 'invalido.pdf' }],
      },
      {
        ...baseItem,
        id: 24,
        acervoId: 204,
        tipoAcervo: TipoAcervoDisplay[TipoAcervo.Fotografico],
        titulo: 'Item Com Múltiplos Anexos',
        arquivos: [
          { codigo: 'cod-mult-1', nome: 'parte1.pdf' },
          { codigo: 'cod-mult-2', nome: 'parte2.pdf' },
        ],
      },
    ];

    const { container } = renderWithProviders({ initialDataSource: itensComAnexos });

    expect(screen.getByText('Sem anexo')).toBeInTheDocument();

    // Clica em Download arquivo do item com 1 anexo válido
    const btnDownloadUnico = screen.getByRole('button', { name: /download arquivo/i });
    fireEvent.click(btnDownloadUnico);

    await waitFor(() => {
      expect(mockedObterArquivoDownload).toHaveBeenCalledWith('cod-unico-1');
      expect(mockedDownloadBlob).toHaveBeenCalledWith(fakeBlob, 'documento-unico.pdf');
    });

    // Expande a linha com múltiplos anexos (índice 3)
    const btnExpandir = container.querySelector(
      `#${CDEP_BUTTON_EXPANDIR_LINHA}_3`,
    ) as HTMLButtonElement;
    expect(btnExpandir).toBeInTheDocument();
    fireEvent.click(btnExpandir);

    await waitFor(() => {
      expect(screen.getByText('parte1.pdf')).toBeInTheDocument();
      expect(screen.getByText('parte2.pdf')).toBeInTheDocument();
    });

    // Clica em download dentro da tabela expandida
    const botoesDownload = screen.getAllByRole('button', { name: /download arquivo/i });
    fireEvent.click(botoesDownload[1]);

    await waitFor(() => {
      expect(mockedObterArquivoDownload).toHaveBeenCalledWith('cod-mult-1');
      expect(mockedDownloadBlob).toHaveBeenCalledWith(fakeBlob, 'parte1.pdf');
    });

    // Clica novamente em Expandir arquivos para recolher a linha
    const btnRecolher = container.querySelector(
      `#${CDEP_BUTTON_EXPANDIR_LINHA}_3`,
    ) as HTMLButtonElement;
    fireEvent.click(btnRecolher);
    await waitFor(() => {
      const expandedRow = container.querySelector('tr.ant-table-expanded-row');
      expect(expandedRow).toHaveStyle({ display: 'none' });
    });
  });

  it('C25: em nova solicitação, clicar no ícone de remover acervo deve atualizar dataSource e despachar setAcervosSelecionados sem o item removido', () => {
    const item1 = { ...baseItem, acervoId: 100, titulo: 'Item 100' };
    const item2 = { ...baseItem, id: 11, acervoId: 200, titulo: 'Item 200' };

    const { container, store, setDataSourceSpy } = renderWithProviders({
      acervosSelecionados: [100, 200],
      initialDataSource: [item1, item2],
    });

    const iconeRemover = container.querySelector(`#${CDEP_BUTTON_REMOVER_ACERVO}_0`) as HTMLElement;
    expect(iconeRemover).toBeInTheDocument();

    fireEvent.click(iconeRemover);

    expect(setDataSourceSpy).toHaveBeenCalledWith([item2]);
    expect(store.getState().solicitacao.acervosSelecionados).toEqual([200]);
  });

  it('C26 e C27: em solicitação existente (solicitacaoId > 0), deve buscar obterMinhaSolicitacaoPorId e redirecionar para ROUTES.PRINCIPAL quando validarSeTemAnexos=true e não houver anexos', async () => {
    mockUseParams.mockReturnValue({ id: '77' });
    mockUseLocation.mockReturnValue({ state: { validarSeTemAnexos: true } });

    mockedObterPorId.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        podeCancelarSolicitacao: true,
        itens: [{ ...baseItem, arquivos: [] }],
      },
      mensagens: [],
    });

    const { unmount } = renderWithProviders();

    await waitFor(() => {
      expect(mockedObterPorId).toHaveBeenCalledWith(77);
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
    });

    unmount();
    mockNavigate.mockReset();

    // Quando validarSeTemAnexos=true e há anexo, permanece na tela
    mockedObterPorId.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        podeCancelarSolicitacao: false,
        itens: [
          {
            ...baseItem,
            arquivos: [{ codigo: 'arq-1', nome: 'anexo.pdf' }],
          },
        ],
      },
      mensagens: [],
    });

    renderWithProviders();

    await waitFor(() => {
      expect(mockedObterPorId).toHaveBeenCalledWith(77);
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('C28: deve renderizar Data de visita formatada ou DatePicker editável e salvar nova data de visita (sucesso e falha)', async () => {
    mockUseParams.mockReturnValue({ id: '88' });

    const itemEditavelComData: ItemSolicitacaoTestDTO = {
      ...baseItem,
      id: 301,
      acervoId: 3001,
      titulo: 'Item Visita Editável Com Data',
      dataVisita: '2099-10-15T14:30:00',
      alteraDataVisita: true,
    };

    const itemEditavelSemData: ItemSolicitacaoTestDTO = {
      ...baseItem,
      id: 302,
      acervoId: 3002,
      titulo: 'Item Visita Editável Sem Data',
      dataVisita: '',
      alteraDataVisita: true,
    };

    const itemSomenteLeituraComData: ItemSolicitacaoTestDTO = {
      ...baseItem,
      id: 303,
      acervoId: 3003,
      titulo: 'Item Visita Fixa',
      dataVisita: '2026-05-20T10:00:00',
      alteraDataVisita: false,
    };

    mockedObterPorId.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        podeCancelarSolicitacao: true,
        itens: [itemEditavelComData, itemSomenteLeituraComData],
      },
      mensagens: [],
    });

    const { container, unmount } = renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('20/05 10:00')).toBeInTheDocument();
    });

    // Altera a data no DatePicker
    const dateInput = container.querySelector('.ant-picker-input input') as HTMLInputElement;
    expect(dateInput).toBeInTheDocument();

    fireEvent.mouseDown(dateInput);
    fireEvent.change(dateInput, { target: { value: '25/12/2099' } });
    fireEvent.keyDown(dateInput, { key: 'Enter', code: 'Enter', keyCode: 13 });
    fireEvent.blur(dateInput);

    const btnConfirmar = await screen.findByRole('button', { name: /confirmar/i });
    expect(btnConfirmar).toBeInTheDocument();

    mockedAlterarDataVisita.mockResolvedValueOnce({
      sucesso: true,
      dados: true,
      mensagens: [],
    });
    mockedObterPorId.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        podeCancelarSolicitacao: true,
        itens: [itemEditavelComData, itemSomenteLeituraComData],
      },
      mensagens: [],
    });

    fireEvent.click(btnConfirmar);

    await waitFor(() => {
      expect(mockedAlterarDataVisita).toHaveBeenCalledWith({
        id: 301,
        dataVisita: expect.anything(),
      });
      expect(notification.success).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Data inserida/alterada com sucesso',
      });
    });

    unmount();

    // Segundo fluxo: item sem dataVisita prévia e alterarDataVisitaDoItemAtendimento retorna sucesso: false
    (notification.success as jest.Mock).mockReset();
    mockedObterPorId.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        podeCancelarSolicitacao: true,
        itens: [itemEditavelSemData],
      },
      mensagens: [],
    });

    const { container: container2 } = renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Item Visita Editável Sem Data')).toBeInTheDocument();
    });

    const dateInput2 = container2.querySelector('.ant-picker-input input') as HTMLInputElement;
    fireEvent.mouseDown(dateInput2);
    fireEvent.change(dateInput2, { target: { value: '26/12/2099' } });
    fireEvent.keyDown(dateInput2, { key: 'Enter', code: 'Enter', keyCode: 13 });
    fireEvent.blur(dateInput2);

    const btnConfirmar2 = await screen.findByRole('button', { name: /confirmar/i });

    mockedAlterarDataVisita.mockResolvedValueOnce({
      sucesso: false,
      dados: false,
      mensagens: ['Erro ao salvar data'],
    });

    fireEvent.click(btnConfirmar2);

    await waitFor(() => {
      expect(mockedAlterarDataVisita).toHaveBeenCalledWith({
        id: 302,
        dataVisita: expect.anything(),
      });
    });
    expect(notification.success).not.toHaveBeenCalled();
  });

  it('C29: em solicitação existente, deve controlar habilitação do botão "Cancelar item" por situação e executar cancelarItemAtendimento (sucesso e falha)', async () => {
    mockUseParams.mockReturnValue({ id: '90' });

    const itensSituacoes: AcervoSolicitacaoItemRetornoCadastroDTO[] = [
      {
        ...baseItem,
        id: 401,
        acervoId: 4001,
        situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO,
        alteraDataVisita: false,
      },
      {
        ...baseItem,
        id: 402,
        acervoId: 4002,
        situacaoId: SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE,
      },
      {
        ...baseItem,
        id: 403,
        acervoId: 4003,
        situacaoId: SituacaoSolicitacaoItemEnum.FINALIZADO_AUTOMATICAMENTE,
      },
      {
        ...baseItem,
        id: 404,
        acervoId: 4004,
        situacaoId: SituacaoSolicitacaoItemEnum.CANCELADO,
      },
      {
        ...baseItem,
        id: 405,
        acervoId: 4005,
        situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_VISITA,
        alteraDataVisita: false,
      },
    ];

    mockedObterPorId.mockResolvedValue({
      sucesso: true,
      dados: {
        podeCancelarSolicitacao: true,
        itens: itensSituacoes,
      },
      mensagens: [],
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /cancelar item/i })).toHaveLength(5);
    });

    const botoesCancelar = screen.getAllByRole('button', { name: /cancelar item/i });
    expect(botoesCancelar[0]).not.toBeDisabled();
    expect(botoesCancelar[1]).toBeDisabled();
    expect(botoesCancelar[2]).toBeDisabled();
    expect(botoesCancelar[3]).toBeDisabled();
    expect(botoesCancelar[4]).toBeDisabled();

    // Sucesso ao cancelar item
    mockedCancelarItem.mockResolvedValueOnce({
      sucesso: true,
      dados: true,
      mensagens: [],
    });

    fireEvent.click(botoesCancelar[0]);

    await waitFor(() => {
      expect(mockedCancelarItem).toHaveBeenCalledWith(401);
      expect(notification.success).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Item cancelado com sucesso',
      });
    });

    // Falha ao cancelar item (sucesso = false)
    (notification.success as jest.Mock).mockReset();
    mockedCancelarItem.mockResolvedValueOnce({
      sucesso: false,
      dados: false,
      mensagens: ['Erro'],
    });

    fireEvent.click(botoesCancelar[0]);

    await waitFor(() => {
      expect(mockedCancelarItem).toHaveBeenCalledWith(401);
    });
    expect(notification.success).not.toHaveBeenCalled();
  });
});
