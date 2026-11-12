/* eslint-disable @typescript-eslint/no-var-requires */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  CDEP_BUTTON_ADICIONAR_ACERVOS,
  CDEP_BUTTON_EXPANDIR_LINHA,
  CDEP_BUTTON_REMOVER_ACERVO,
} from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes';
import { SituacaoSolicitacaoItemEnum } from '~/core/enum/situacao-item-atendimento-enum';
import { TipoAcervo, TipoAcervoDisplay } from '~/core/enum/tipo-acervo';
import { setAcervosSelecionados } from '~/core/redux/modules/solicitacao/actions';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import armazenamentoService from '~/core/services/armazenamento-service';
import { notification } from '~/components/lib/notification';
import { downloadBlob } from '~/core/utils/functions';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { AcervoSolicitacaoContext } from '../../provider';
import ListaAcervosSolicitacao from './index';

let mockParams: { id?: string } = {};
let mockLocation: { state?: any } = {};
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
let mockSolicitacaoState: { acervosSelecionados: number[] } = {
  acervosSelecionados: [10, 20],
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
  useLocation: () => mockLocation,
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) =>
    selector({
      solicitacao: mockSolicitacaoState,
    }),
}));

jest.mock('~/core/redux/modules/solicitacao/actions', () => ({
  setAcervosSelecionados: jest.fn((payload) => ({
    type: 'SET_ACERVOS_SELECIONADOS',
    payload,
  })),
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

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('~/core/utils/functions', () => ({
  ...jest.requireActual('~/core/utils/functions'),
  downloadBlob: jest.fn(),
}));

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  const React = require('react');
  return {
    ...actual,
    DatePicker: (props: any) => {
      const { dayjs } = require('~/core/date/dayjs');
      return React.createElement('input', {
        'data-testid': 'mock-datepicker',
        placeholder: 'Select date',
        value: props.value ? props.value.format?.('YYYY-MM-DD') ?? String(props.value) : '',
        onChange: (e: any) => {
          props.onChange?.(e.target.value ? dayjs(e.target.value) : null);
        },
      });
    },
  };
});

jest.mock('antd/es/table', () => {
  const React = require('react');
  return function MockTable({ columns, dataSource, expandable }: any) {
    if (!dataSource || dataSource.length === 0) {
      return React.createElement('div', { 'data-testid': 'empty-table' }, 'Sem dados');
    }
    return React.createElement(
      'table',
      { 'data-testid': 'mock-table' },
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          columns?.map((col: any, index: number) =>
            React.createElement('th', { key: col.title ?? col.dataIndex ?? index }, col.title),
          ),
        ),
      ),
      React.createElement(
        'tbody',
        null,
        dataSource?.map((linha: any, index: number) => {
          const isExpanded = expandable?.expandedRowKeys?.includes(linha.acervoId);
          return React.createElement(
            React.Fragment,
            { key: linha.acervoId ?? linha.codigo ?? index },
            React.createElement(
              'tr',
              { 'data-testid': `linha-${linha.acervoId ?? linha.codigo ?? index}` },
              columns?.map((col: any, colIdx: number) => {
                const val = col.dataIndex ? linha[col.dataIndex] : undefined;
                return React.createElement(
                  'td',
                  { key: col.title ?? col.dataIndex ?? colIdx },
                  col.render ? col.render(val, linha, index) : val,
                );
              }),
            ),
            isExpanded && expandable?.expandedRowRender
              ? React.createElement(
                  'tr',
                  { 'data-testid': `linha-expandida-${linha.acervoId}` },
                  React.createElement(
                    'td',
                    { colSpan: columns?.length },
                    expandable.expandedRowRender(linha, index),
                  ),
                )
              : null,
          );
        }),
      ),
    );
  };
});

describe('ListaAcervosSolicitacao', () => {
  const mockItemBibliograficoDisponivel = {
    id: 1,
    acervoId: 10,
    tipoAcervo: TipoAcervoDisplay[TipoAcervo.Bibliografico],
    titulo: 'Livro de História do Brasil',
    autoresCreditos: ['Autor 1', 'Autor 2'],
    situacao: 'Pendente',
    situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO,
    tipoAtendimento: 'Presencial',
    estaDisponivel: true,
    situacaoDisponibilidade: 'Disponível',
    dataVisita: '2026-06-10 14:00',
    alteraDataVisita: false,
    arquivos: [{ codigo: 'ARQ-01', nome: 'documento.pdf' }],
  };

  const mockItemBibliograficoIndisponivel = {
    id: 2,
    acervoId: 20,
    tipoAcervo: TipoAcervoDisplay[TipoAcervo.Bibliografico],
    titulo: 'Livro Raro Indisponível',
    autoresCreditos: [],
    situacao: 'Em atendimento',
    situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO,
    tipoAtendimento: 'Presencial',
    estaDisponivel: false,
    situacaoDisponibilidade: 'Emprestado',
    dataVisita: '',
    alteraDataVisita: false,
    arquivos: [],
  };

  const mockItemAudiovisualComMultiplosArquivos = {
    id: 3,
    acervoId: 30,
    tipoAcervo: TipoAcervoDisplay[TipoAcervo.Audiovisual],
    titulo: 'Filme Documentário',
    autoresCreditos: undefined,
    situacao: 'Finalizado',
    situacaoId: SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE,
    tipoAtendimento: 'Digital',
    dataVisita: '2026-06-15 10:00',
    alteraDataVisita: true,
    arquivos: [
      { codigo: 'VID-01', nome: 'video_parte1.mp4' },
      { codigo: 'VID-02', nome: 'video_parte2.mp4' },
    ],
  };

  const mockItemAudiovisualSemCodigo = {
    id: 4,
    acervoId: 40,
    tipoAcervo: TipoAcervoDisplay[TipoAcervo.Audiovisual],
    titulo: 'Áudio Sem Código',
    situacao: 'Cancelado',
    situacaoId: SituacaoSolicitacaoItemEnum.CANCELADO,
    tipoAtendimento: 'Presencial',
    dataVisita: '2026-06-12 10:00',
    alteraDataVisita: false,
    arquivos: [{ codigo: '', nome: 'sem_codigo.mp3' }],
  };

  const mockItemAguardandoVisita = {
    id: 5,
    acervoId: 50,
    tipoAcervo: TipoAcervoDisplay[TipoAcervo.Bibliografico],
    titulo: 'Livro Aguardando Visita',
    situacao: 'Aguardando visita',
    situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_VISITA,
    tipoAtendimento: 'Presencial',
    alteraDataVisita: false,
  };

  const mockItemFinalizadoAutomaticamente = {
    id: 6,
    acervoId: 60,
    tipoAcervo: TipoAcervoDisplay[TipoAcervo.Audiovisual],
    titulo: 'Áudio Finalizado Automático',
    situacao: 'Finalizado',
    situacaoId: SituacaoSolicitacaoItemEnum.FINALIZADO_AUTOMATICAMENTE,
    tipoAtendimento: 'Presencial',
    alteraDataVisita: false,
  };

  const mockSetDataSource = jest.fn();
  const mockSetPodeCancelarSolicitacao = jest.fn();

  const defaultAcervoContext = {
    dataSource: [
      mockItemBibliograficoDisponivel,
      mockItemBibliograficoIndisponivel,
      mockItemAudiovisualComMultiplosArquivos,
      mockItemAudiovisualSemCodigo,
      mockItemAguardandoVisita,
      mockItemFinalizadoAutomaticamente,
    ],
    setDataSource: mockSetDataSource,
    podeCancelarSolicitacao: true,
    setPodeCancelarSolicitacao: mockSetPodeCancelarSolicitacao,
    carregarDados: jest.fn(),
  };

  const defaultPermissaoContext = {
    desabilitarCampos: false,
    setDesabilitarCampos: jest.fn(),
    permissao: {
      customRoles: [],
      podeAlterar: true,
      podeConsultar: true,
      podeExcluir: true,
      podeIncluir: true,
      somenteConsulta: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    mockLocation = {};
    mockSolicitacaoState = { acervosSelecionados: [10, 20] };
    (acervoSolicitacaoService.obterItensDoAcervoPorFiltros as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: [],
    });
    (acervoSolicitacaoService.obterMinhaSolicitacaoPorId as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: { itens: [], podeCancelarSolicitacao: false },
    });
    (acervoSolicitacaoService.alterarDataVisitaDoItemAtendimento as jest.Mock).mockResolvedValue({
      sucesso: true,
    });
    (acervoSolicitacaoService.cancelarItemAtendimento as jest.Mock).mockResolvedValue({
      sucesso: true,
    });
    (armazenamentoService.obterArquivoParaDownload as jest.Mock).mockResolvedValue({
      data: new Blob(['conteudo do arquivo']),
    });
  });

  const renderComponent = (
    acervoContext: any = defaultAcervoContext,
    permissaoContext: any = defaultPermissaoContext,
  ) =>
    render(
      <AcervoSolicitacaoContext.Provider value={acervoContext}>
        <PermissaoContext.Provider value={permissaoContext}>
          <ListaAcervosSolicitacao />
        </PermissaoContext.Provider>
      </AcervoSolicitacaoContext.Provider>,
    );

  describe('Modo Criação (!solicitacaoId)', () => {
    it('deve carregar itens por filtros ao montar se houver acervosSelecionados', async () => {
      (acervoSolicitacaoService.obterItensDoAcervoPorFiltros as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
        dados: [mockItemBibliograficoDisponivel],
      });

      renderComponent();

      await waitFor(() => {
        expect(acervoSolicitacaoService.obterItensDoAcervoPorFiltros).toHaveBeenCalledWith([
          10, 20,
        ]);
        expect(mockSetDataSource).toHaveBeenCalledWith([mockItemBibliograficoDisponivel]);
      });
    });

    it('deve definir dataSource vazio se obterItensDoAcervoPorFiltros retornar sucesso false', async () => {
      (acervoSolicitacaoService.obterItensDoAcervoPorFiltros as jest.Mock).mockResolvedValueOnce({
        sucesso: false,
      });

      renderComponent();

      await waitFor(() => {
        expect(acervoSolicitacaoService.obterItensDoAcervoPorFiltros).toHaveBeenCalled();
        expect(mockSetDataSource).toHaveBeenCalledWith([]);
      });
    });

    it('deve navegar para consulta-acervo ao clicar em "Adicionar acervos"', () => {
      renderComponent();

      const btnAdicionar = document.getElementById(CDEP_BUTTON_ADICIONAR_ACERVOS)!;
      expect(btnAdicionar).not.toBeDisabled();

      fireEvent.click(btnAdicionar);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CONSULTA_ACERVO);
    });

    it('deve remover acervo e atualizar acervosSelecionados no Redux ao clicar no ícone de lixeira', () => {
      renderComponent();

      const btnRemover0 = document.getElementById(`${CDEP_BUTTON_REMOVER_ACERVO}_0`)!;
      fireEvent.click(btnRemover0);

      expect(mockSetDataSource).toHaveBeenCalledWith(
        expect.not.arrayContaining([mockItemBibliograficoDisponivel]),
      );
      expect(mockDispatch).toHaveBeenCalledWith(setAcervosSelecionados([20]));
    });

    it('deve desabilitar botão de remover acervo quando permissao.somenteConsulta for true', () => {
      renderComponent(defaultAcervoContext, {
        ...defaultPermissaoContext,
        permissao: { ...defaultPermissaoContext.permissao, somenteConsulta: true },
      });

      const btnRemover0 = document
        .getElementById(`${CDEP_BUTTON_REMOVER_ACERVO}_0`)!
        .closest('button')!;
      expect(btnRemover0).toBeDisabled();
    });

    it('não deve chamar obterItensDoAcervoPorFiltros se acervosSelecionados estiver vazio', () => {
      mockSolicitacaoState = { acervosSelecionados: [] };
      renderComponent();

      expect(acervoSolicitacaoService.obterItensDoAcervoPorFiltros).not.toHaveBeenCalled();
    });
  });

  describe('Modo Detalhes / Consulta (solicitacaoId > 0)', () => {
    beforeEach(() => {
      mockParams = { id: '123' };
    });

    it('deve carregar dados da solicitação por ID e configurar podeCancelarSolicitacao', async () => {
      (acervoSolicitacaoService.obterMinhaSolicitacaoPorId as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
        dados: {
          itens: [mockItemBibliograficoDisponivel],
          podeCancelarSolicitacao: true,
        },
      });

      renderComponent();

      await waitFor(() => {
        expect(acervoSolicitacaoService.obterMinhaSolicitacaoPorId).toHaveBeenCalledWith(123);
        expect(mockSetDataSource).toHaveBeenCalledWith([mockItemBibliograficoDisponivel]);
        expect(mockSetPodeCancelarSolicitacao).toHaveBeenCalledWith(true);
      });
    });

    it('deve navegar para ROUTES.PRINCIPAL se validarSeTemAnexos for true e nenhum item tiver anexos', async () => {
      mockLocation = { state: { validarSeTemAnexos: true } };

      (acervoSolicitacaoService.obterMinhaSolicitacaoPorId as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
        dados: {
          itens: [
            {
              ...mockItemBibliograficoDisponivel,
              arquivos: [],
            },
          ],
          podeCancelarSolicitacao: true,
        },
      });

      renderComponent();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
      });
    });

    it('não deve navegar para ROUTES.PRINCIPAL se validarSeTemAnexos for true e houver anexo', async () => {
      mockLocation = { state: { validarSeTemAnexos: true } };

      (acervoSolicitacaoService.obterMinhaSolicitacaoPorId as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
        dados: {
          itens: [mockItemBibliograficoDisponivel],
          podeCancelarSolicitacao: true,
        },
      });

      renderComponent();

      await waitFor(() => {
        expect(acervoSolicitacaoService.obterMinhaSolicitacaoPorId).toHaveBeenCalled();
      });

      expect(mockNavigate).not.toHaveBeenCalledWith(ROUTES.PRINCIPAL);
    });

    it('deve definir dataSource vazio e podeCancelarSolicitacao false se obterMinhaSolicitacaoPorId falhar', async () => {
      (acervoSolicitacaoService.obterMinhaSolicitacaoPorId as jest.Mock).mockResolvedValueOnce({
        sucesso: false,
      });

      renderComponent();

      await waitFor(() => {
        expect(mockSetDataSource).toHaveBeenCalledWith([]);
        expect(mockSetPodeCancelarSolicitacao).toHaveBeenCalledWith(false);
      });
    });

    it('deve desabilitar botão "Adicionar acervos" quando solicitacaoId estiver presente', () => {
      renderComponent();

      expect(document.getElementById(CDEP_BUTTON_ADICIONAR_ACERVOS)).toBeDisabled();
    });

    it('deve cancelar item de atendimento com sucesso e recarregar dados', async () => {
      (acervoSolicitacaoService.cancelarItemAtendimento as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
      });

      renderComponent();

      const btnCancelarItem = screen.getAllByRole('button', { name: /cancelar item/i })[0];
      expect(btnCancelarItem).not.toBeDisabled();

      fireEvent.click(btnCancelarItem);

      await waitFor(() => {
        expect(acervoSolicitacaoService.cancelarItemAtendimento).toHaveBeenCalledWith(1);
        expect(notification.success).toHaveBeenCalledWith(
          expect.objectContaining({ description: 'Item cancelado com sucesso' }),
        );
        expect(acervoSolicitacaoService.obterMinhaSolicitacaoPorId).toHaveBeenCalled();
      });
    });

    it('deve desabilitar "Cancelar item" quando o item já estiver finalizado ou cancelado', () => {
      renderComponent();

      const btns = screen.getAllByRole('button', { name: /cancelar item/i });
      // Item com id 3 (FINALIZADO_MANUALMENTE)
      expect(btns[2]).toBeDisabled();
      // Item com id 4 (CANCELADO)
      expect(btns[3]).toBeDisabled();
      // Item com id 5 (AGUARDANDO_VISITA sem alteraDataVisita)
      expect(btns[4]).toBeDisabled();
      // Item com id 6 (FINALIZADO_AUTOMATICAMENTE)
      expect(btns[5]).toBeDisabled();
    });

    it('não deve exibir notificação se cancelarItemAtendimento retornar sucesso false', async () => {
      (acervoSolicitacaoService.cancelarItemAtendimento as jest.Mock).mockResolvedValueOnce({
        sucesso: false,
      });

      renderComponent();

      const btnCancelarItem = screen.getAllByRole('button', { name: /cancelar item/i })[0];
      fireEvent.click(btnCancelarItem);

      await waitFor(() => {
        expect(acervoSolicitacaoService.cancelarItemAtendimento).toHaveBeenCalledWith(1);
        expect(notification.success).not.toHaveBeenCalled();
      });
    });
  });

  describe('Renderização de Colunas, Disponibilidade e Tags', () => {
    it('deve renderizar colunas de título, autores/créditos e disponibilidade com tags corretas', () => {
      renderComponent();

      expect(screen.getByText('Livro de História do Brasil')).toBeInTheDocument();
      expect(screen.getByText('Autor 1')).toBeInTheDocument();
      expect(screen.getByText('Autor 2')).toBeInTheDocument();

      // Disponibilidade
      expect(screen.getByText('Disponível')).toBeInTheDocument();
      expect(screen.getByText('Emprestado')).toBeInTheDocument();
    });

    it('não deve incluir coluna de disponibilidade se não houver item bibliográfico', () => {
      renderComponent({
        ...defaultAcervoContext,
        dataSource: [mockItemAudiovisualComMultiplosArquivos],
      });

      expect(screen.queryByText('Disponibilidade')).not.toBeInTheDocument();
    });

    it('não deve incluir coluna de anexos se nenhum item tiver arquivos', () => {
      renderComponent({
        ...defaultAcervoContext,
        dataSource: [mockItemBibliograficoIndisponivel],
      });

      expect(screen.queryByText('Anexo')).not.toBeInTheDocument();
    });

    it('deve renderizar estado vazio quando dataSource for vazio ou indefinido', () => {
      const { rerender } = renderComponent({
        ...defaultAcervoContext,
        dataSource: [],
      });

      expect(screen.getByTestId('empty-table')).toBeInTheDocument();

      rerender(
        <AcervoSolicitacaoContext.Provider
          value={{
            ...defaultAcervoContext,
            dataSource: undefined as any,
          }}
        >
          <PermissaoContext.Provider value={defaultPermissaoContext}>
            <ListaAcervosSolicitacao />
          </PermissaoContext.Provider>
        </AcervoSolicitacaoContext.Provider>,
      );

      expect(screen.getByTestId('empty-table')).toBeInTheDocument();
    });
  });

  describe('Ações de Arquivos e Download', () => {
    it('deve baixar arquivo único ao clicar no botão de download', async () => {
      renderComponent();

      const btnDownload = screen.getByRole('button', { name: /download arquivo/i });
      fireEvent.click(btnDownload);

      await waitFor(() => {
        expect(armazenamentoService.obterArquivoParaDownload).toHaveBeenCalledWith('ARQ-01');
        expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), 'documento.pdf');
      });
    });

    it('deve expandir e colapsar arquivos quando houver múltiplos arquivos no item', () => {
      renderComponent();

      const btnExpandir = document.getElementById(`${CDEP_BUTTON_EXPANDIR_LINHA}_2`)!;
      expect(btnExpandir).toBeInTheDocument();

      // Clica para expandir
      fireEvent.click(btnExpandir);
      expect(screen.getByTestId('linha-expandida-30')).toBeInTheDocument();
      expect(screen.getByText('video_parte1.mp4')).toBeInTheDocument();
      expect(screen.getByText('video_parte2.mp4')).toBeInTheDocument();

      // Clica para colapsar
      fireEvent.click(btnExpandir);
      expect(screen.queryByTestId('linha-expandida-30')).not.toBeInTheDocument();
    });

    it('deve baixar arquivo de dentro da linha expandida', async () => {
      renderComponent();

      const btnExpandir = document.getElementById(`${CDEP_BUTTON_EXPANDIR_LINHA}_2`)!;
      fireEvent.click(btnExpandir);

      const downloadBtns = screen.getAllByRole('button', { name: /download arquivo/i });
      expect(downloadBtns.length).toBeGreaterThan(1);
      fireEvent.click(downloadBtns[1]);

      await waitFor(() => {
        expect(armazenamentoService.obterArquivoParaDownload).toHaveBeenCalledWith('VID-01');
        expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), 'video_parte1.mp4');
      });
    });
  });

  describe('Data de Visita e Edição', () => {
    it('deve permitir alterar data de visita no DatePicker e salvar via botão Confirmar', async () => {
      (
        acervoSolicitacaoService.alterarDataVisitaDoItemAtendimento as jest.Mock
      ).mockResolvedValueOnce({
        sucesso: true,
      });

      mockParams = { id: '123' };
      renderComponent();

      const datepickerInput = screen.getByPlaceholderText('Select date');
      expect(datepickerInput).toBeInTheDocument();

      // Altera a data no DatePicker
      fireEvent.change(datepickerInput, { target: { value: '2026-12-15' } });

      // O botão Confirmar deve aparecer
      const btnConfirmar = screen.getByRole('button', { name: /confirmar/i });
      expect(btnConfirmar).toBeInTheDocument();

      fireEvent.click(btnConfirmar);

      await waitFor(() => {
        expect(acervoSolicitacaoService.alterarDataVisitaDoItemAtendimento).toHaveBeenCalledWith({
          id: 3,
          dataVisita: expect.any(Object),
        });
        expect(notification.success).toHaveBeenCalledWith(
          expect.objectContaining({ description: 'Data inserida/alterada com sucesso' }),
        );
      });
    });

    it('não deve exibir notificação de sucesso se alterarDataVisitaDoItemAtendimento falhar', async () => {
      (
        acervoSolicitacaoService.alterarDataVisitaDoItemAtendimento as jest.Mock
      ).mockResolvedValueOnce({
        sucesso: false,
      });

      mockParams = { id: '123' };
      renderComponent();

      const datepickerInput = screen.getByPlaceholderText('Select date');
      fireEvent.change(datepickerInput, { target: { value: '2026-12-15' } });

      const btnConfirmar = screen.getByRole('button', { name: /confirmar/i });
      fireEvent.click(btnConfirmar);

      await waitFor(() => {
        expect(acervoSolicitacaoService.alterarDataVisitaDoItemAtendimento).toHaveBeenCalled();
        expect(notification.success).not.toHaveBeenCalled();
      });
    });

    it('deve renderizar data formatada ou vazia quando alteraDataVisita for false', () => {
      renderComponent({
        ...defaultAcervoContext,
        dataSource: [
          {
            ...mockItemBibliograficoDisponivel,
            alteraDataVisita: false,
            dataVisita: '2026-06-10 14:00',
          },
          {
            ...mockItemBibliograficoIndisponivel,
            alteraDataVisita: false,
            dataVisita: '',
          },
        ],
      });

      expect(screen.getByText('10/06 14:00')).toBeInTheDocument();
    });
  });
});
