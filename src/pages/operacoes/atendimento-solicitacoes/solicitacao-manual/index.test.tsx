import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  CDEP_BUTTON_ADICIONAR_ACERVOS,
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_CONFIRMAR,
  CDEP_BUTTON_EDITAR,
  CDEP_BUTTON_FINALIZAR,
  CDEP_BUTTON_REMOVER_ACERVO,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_CANCELAR_ITEM,
  DESEJA_FINALIZAR_ATENDIMENTO,
  DESEJA_REMOVER_ACERVO,
  DESEJA_SAIR_MODO_EDICAO,
  DESEJA_SAIR_MODO_EDICAO_CONFIRMANDO_ITENS_SOLICITACAO_ALTERADOS,
  DESEJA_SAIR_MODO_EDICAO_FINALIZANDO_ATENDIMENTO,
} from '~/core/constants/mensagens';
import { ROUTES } from '~/core/enum/routes';
import { SituacaoSolicitacaoItemEnum } from '~/core/enum/situacao-item-atendimento-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoAtendimentoEnum } from '~/core/enum/tipo-atendimento-enum';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { confirmacao } from '~/core/services/alerta-service';
import { notification } from '~/components/lib/notification';
import usuarioService from '~/core/services/usuario-service';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { SolicitacaoManual } from './index';

let mockParams: { id?: string } = {};
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('~/core/services/acervo-solicitacao-service', () => ({
  __esModule: true,
  default: {
    obterDetalhesParaAtendimentoSolicitacoesPorId: jest.fn(),
    cancelarItemAtendimento: jest.fn(),
    finalizarAtendimento: jest.fn(),
    confirmarAtendimentoManual: jest.fn(),
    alterarAtendimentoManual: jest.fn(),
  },
}));

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    obterRfCpf: jest.fn(),
  },
}));

jest.mock('~/components/lib/data-table', () => {
  return function MockDataTable({ columns, dataSource }: any) {
    return (
      <table data-testid='data-table'>
        <thead>
          <tr>
            {columns?.map((col: any, index: number) => (
              <th key={col.title ?? col.dataIndex ?? index}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource?.map((linha: any, index: number) => (
            <tr
              key={linha.id ?? linha.acervoId ?? index}
              data-testid={`linha-${linha.id ?? index}`}
            >
              {columns?.map((col: any, colIdx: number) => {
                const val = col.dataIndex ? linha[col.dataIndex] : undefined;
                return (
                  <td key={col.title ?? col.dataIndex ?? colIdx}>
                    {col.render ? col.render(val, linha, index) : val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
});

jest.mock('./components/rf-cpf', () => ({
  __esModule: true,
  InputRfCpf: ({ inputProps, formItemProps }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Form, Input } = require('antd');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const usuarioService = require('~/core/services/usuario-service').default;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { dayjs } = require('~/core/date/dayjs');

    const form = Form.useFormInstance();
    const rfCpf = Form.useWatch(['dadosSolicitante', 'login'], form);

    const buscarRfCpf = async () => {
      usuarioService.obterRfCpf(rfCpf).then((resposta: any) => {
        if (resposta.sucesso) {
          form.setFieldValue('dadosSolicitante', { ...resposta.dados });
          form.setFieldValue('dataSolicitacao', dayjs());
        } else {
          form.setFieldValue(['dadosSolicitante'], []);
          form.setFieldValue('dataSolicitacao', null);
        }
      });
    };

    return (
      <Form.Item label='RF ou CPF' name={['dadosSolicitante', 'login']} {...formItemProps}>
        <Input.Search
          onSearch={buscarRfCpf}
          maxLength={11}
          placeholder='Informe o RF ou CPF'
          onChange={(e: any) => {
            if (e.target.value.length === 0) {
              form.setFieldValue(['dadosSolicitante'], []);
            }
          }}
          {...inputProps}
        />
      </Form.Item>
    );
  },
}));

jest.mock('./components/modal-adicionar-acervo', () => ({
  ModalAdicionarAcervo: ({
    isModalOpen,
    setIsModalOpen,
    formSolicitacaoManual,
    initialValuesModal,
  }: any) =>
    isModalOpen ? (
      <div data-testid='modal-adicionar-acervo'>
        <span>Modal Aberto</span>
        <span data-testid='initial-item-titulo'>{initialValuesModal?.titulo ?? 'novo'}</span>
        <button type='button' data-testid='btn-fechar-modal' onClick={() => setIsModalOpen(false)}>
          Fechar Modal
        </button>
        <button
          type='button'
          data-testid='btn-adicionar-item-mock'
          onClick={() => {
            const currentItens = formSolicitacaoManual.getFieldValue('itens') || [];
            formSolicitacaoManual.setFieldValue('itens', [
              ...currentItens,
              {
                id: 0,
                acervoId: 99,
                tipoAcervoId: 1, // TipoAcervo.Bibliografico
                titulo: 'Novo Livro Manual',
                codigo: 'TOMBO-99',
                situacaoId: 1, // SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO
                tipoAtendimento: 1, // TipoAtendimentoEnum.Presencial
                dataVisita: '2026-06-01 10:00',
                dataEmprestimo: '2026-06-01',
                dataDevolucao: '2026-06-15',
              },
            ]);
            setIsModalOpen(false);
          }}
        >
          Adicionar Item
        </button>
      </div>
    ) : null,
}));

describe('SolicitacaoManual', () => {
  const mockDetalhesSolicitacao = {
    sucesso: true,
    dados: {
      id: 123,
      situacaoId: 1,
      dataSolicitacao: '2026-05-10T10:00:00',
      dadosSolicitante: {
        id: 10,
        tipoId: TipoUsuario.POPULACAO_GERAL,
        nome: 'Maria da Silva',
        login: '12345678901',
        telefone: '11987654321',
        email: 'maria@email.com',
        endereco: 'Rua das Acácias, 50',
      },
      itens: [
        {
          id: 1,
          acervoId: 100,
          codigo: 'TOMBO-1',
          titulo: 'Livro de História',
          tipoAcervoId: TipoAcervo.Bibliografico,
          situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO,
          tipoAtendimento: TipoAtendimentoEnum.Presencial,
          dataVisita: '2026-05-15 14:00',
          dataVisitaFormatada: '15/05/2026 14:00',
          dataEmprestimo: '2026-05-15',
          dataDevolucao: '2026-05-25',
        },
        {
          id: 2,
          acervoId: 200,
          codigo: 'TOMBO-2',
          titulo: 'Documentário em Vídeo',
          tipoAcervoId: TipoAcervo.Audiovisual,
          situacaoId: SituacaoSolicitacaoItemEnum.CANCELADO,
          tipoAtendimento: TipoAtendimentoEnum.Presencial,
          dataVisita: undefined,
          dataVisitaFormatada: undefined,
          dataEmprestimo: undefined,
          dataDevolucao: undefined,
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: '123' };
    (
      acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock
    ).mockResolvedValue(mockDetalhesSolicitacao);
  });

  const renderComponent = (desabilitarCampos = false) => {
    return render(
      <PermissaoContext.Provider
        value={{
          permissao: { podeIncluir: true, podeAlterar: true, customRoles: [] },
          desabilitarCampos,
          setDesabilitarCampos: jest.fn(),
        }}
      >
        <SolicitacaoManual />
      </PermissaoContext.Provider>,
    );
  };

  it('deve carregar dados da solicitação quando houver id nos parâmetros e renderizar campos e tabela', async () => {
    renderComponent();

    expect(screen.getByText('Atendimento de Solicitações')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId,
      ).toHaveBeenCalledWith(123);
      expect(screen.getByText('Livro de História')).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('Informe o RF ou CPF')).toBeDisabled();
    expect(screen.getByPlaceholderText('Nome do solicitante')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Telefone')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Endereço')).toBeInTheDocument();

    // Colunas e dados da tabela
    expect(screen.getByText('Documentário em Vídeo')).toBeInTheDocument();
    expect(screen.getByText('Data do empréstimo')).toBeInTheDocument();
    expect(screen.getByText('Data da devolução')).toBeInTheDocument();

    // Botão Editar habilitado para item 1 e desabilitado para item 2 (cancelado)
    const btnEditar0 = document.getElementById(`${CDEP_BUTTON_EDITAR}_0`)!;
    const btnEditar1 = document.getElementById(`${CDEP_BUTTON_EDITAR}_1`)!;
    expect(btnEditar0).not.toBeDisabled();
    expect(btnEditar1).toBeDisabled();

    // Botão Cancelar item habilitado para item 1 e desabilitado para item 2
    const btnCancelar0 = document.getElementById(`${CDEP_BUTTON_REMOVER_ACERVO}_0`)!;
    const btnCancelar1 = document.getElementById(`${CDEP_BUTTON_REMOVER_ACERVO}_1`)!;
    expect(btnCancelar0).not.toBeDisabled();
    expect(btnCancelar1).toBeDisabled();
  });

  it('deve redirecionar e exibir notificação se o atendimento retornado já estiver cancelado', async () => {
    (
      acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock
    ).mockResolvedValueOnce({
      sucesso: true,
      dados: {
        ...mockDetalhesSolicitacao.dados,
        situacaoId: SituacaoSolicitacaoItemEnum.CANCELADO,
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
      expect(notification.success).toHaveBeenCalledWith(
        expect.objectContaining({ description: 'Atendimento cancelado com sucesso' }),
      );
    });
  });

  it('não deve renderizar telefone e endereço para usuário CORESSO e tratar telefone/data vazios', async () => {
    (
      acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock
    ).mockResolvedValueOnce({
      sucesso: true,
      dados: {
        ...mockDetalhesSolicitacao.dados,
        dataSolicitacao: null,
        dadosSolicitante: {
          id: 99,
          tipoId: TipoUsuario.CORESSO,
          nome: 'Servidor CORESSO',
          login: '99988877766',
          telefone: null,
          email: 'coresso@email.com',
        },
        itens: [
          {
            id: 1,
            acervoId: 100,
            tipoAcervoId: TipoAcervo.Bibliografico,
            situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO,
            tipoAtendimento: TipoAtendimentoEnum.Presencial,
            dataVisita: '2026-05-15 14:00',
            dataVisitaFormatada: null,
          },
        ],
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Telefone')).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Endereço')).not.toBeInTheDocument();
    });
  });

  describe('Criação de nova solicitação manual (id = 0)', () => {
    beforeEach(() => {
      mockParams = { id: undefined };
    });

    it('deve inicializar com campos vazios e buscar dados do solicitante por RF/CPF com sucesso', async () => {
      (usuarioService.obterRfCpf as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
        dados: {
          id: 25,
          nome: 'Carlos Santos',
          login: '98765432100',
          telefone: '11999998888',
          email: 'carlos@email.com',
          tipoId: TipoUsuario.POPULACAO_GERAL,
        },
      });

      renderComponent();

      expect(
        acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId,
      ).not.toHaveBeenCalled();

      const inputSearch = screen.getByPlaceholderText('Informe o RF ou CPF');
      expect(inputSearch).not.toBeDisabled();

      fireEvent.change(inputSearch, { target: { value: '98765432100' } });

      const btnSearch = screen.getByRole('button', { name: /search/i });
      fireEvent.click(btnSearch);

      await waitFor(() => {
        expect(usuarioService.obterRfCpf).toHaveBeenCalledWith('98765432100');
      });

      // Limpar campo de RF/CPF dispara onChange com value length 0
      fireEvent.change(inputSearch, { target: { value: '' } });
    });

    it('deve limpar dadosSolicitante e dataSolicitacao quando a busca por RF/CPF falhar', async () => {
      (usuarioService.obterRfCpf as jest.Mock).mockResolvedValueOnce({
        sucesso: false,
      });

      renderComponent();

      const inputSearch = screen.getByPlaceholderText('Informe o RF ou CPF');
      fireEvent.change(inputSearch, { target: { value: '00000000000' } });

      const btnSearch = screen.getByRole('button', { name: /search/i });
      fireEvent.click(btnSearch);

      await waitFor(() => {
        expect(usuarioService.obterRfCpf).toHaveBeenCalledWith('00000000000');
      });
    });

    it('deve abrir modal ao clicar em "Adicionar acervos" e incluir novo item', async () => {
      (usuarioService.obterRfCpf as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
        dados: {
          id: 25,
          nome: 'Carlos Santos',
          login: '98765432100',
          tipoId: TipoUsuario.POPULACAO_GERAL,
        },
      });

      renderComponent();

      const inputSearch = screen.getByPlaceholderText('Informe o RF ou CPF');
      fireEvent.change(inputSearch, { target: { value: '98765432100' } });
      fireEvent.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Nome do solicitante')).toHaveValue('Carlos Santos');
      });

      const btnAdicionar = document.getElementById(CDEP_BUTTON_ADICIONAR_ACERVOS)!;
      expect(btnAdicionar).not.toBeDisabled();
      fireEvent.click(btnAdicionar);

      expect(screen.getByTestId('modal-adicionar-acervo')).toBeInTheDocument();

      // Fechar modal
      fireEvent.click(screen.getByTestId('btn-fechar-modal'));
      expect(screen.queryByTestId('modal-adicionar-acervo')).not.toBeInTheDocument();

      // Abrir novamente e adicionar item
      fireEvent.click(btnAdicionar);
      fireEvent.click(screen.getByTestId('btn-adicionar-item-mock'));

      expect(screen.getByText('Novo Livro Manual')).toBeInTheDocument();

      // Remover item recém-adicionado
      const btnRemover = document.getElementById(`${CDEP_BUTTON_REMOVER_ACERVO}_0`)!;
      fireEvent.click(btnRemover);

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({ content: DESEJA_REMOVER_ACERVO }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      confirmCall.onOk();
    });

    it('deve confirmar atendimento de nova solicitação chamando confirmarAtendimentoManual', async () => {
      (usuarioService.obterRfCpf as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
        dados: {
          id: 25,
          nome: 'Carlos Santos',
          login: '98765432100',
          tipoId: TipoUsuario.POPULACAO_GERAL,
        },
      });

      (acervoSolicitacaoService.confirmarAtendimentoManual as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
        dados: 456,
      });

      renderComponent();

      const inputSearch = screen.getByPlaceholderText('Informe o RF ou CPF');
      fireEvent.change(inputSearch, { target: { value: '98765432100' } });
      fireEvent.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Nome do solicitante')).toHaveValue('Carlos Santos');
      });

      fireEvent.click(document.getElementById(CDEP_BUTTON_ADICIONAR_ACERVOS)!);
      fireEvent.click(screen.getByTestId('btn-adicionar-item-mock'));

      const btnConfirmar = document.getElementById(CDEP_BUTTON_CONFIRMAR)!;
      expect(btnConfirmar).not.toBeDisabled();
      fireEvent.click(btnConfirmar);

      await waitFor(() => {
        expect(acervoSolicitacaoService.confirmarAtendimentoManual).toHaveBeenCalledWith(
          expect.objectContaining({
            usuarioId: 25,
            itens: expect.arrayContaining([
              expect.objectContaining({
                acervoId: 99,
                tipoAcervo: TipoAcervo.Bibliografico,
              }),
            ]),
          }),
        );
        expect(notification.success).toHaveBeenCalledWith(
          expect.objectContaining({ description: 'Atendimento confirmado com sucesso' }),
        );
        expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.ATENDIMENTO_SOLICITACAO_MANUAL}/456`);
      });
    });
  });

  describe('Ações de Itens da Tabela', () => {
    it('deve abrir modal ao clicar em Editar preenchendo initialValuesModal', async () => {
      renderComponent();

      await waitFor(() => {
        expect(document.getElementById(`${CDEP_BUTTON_EDITAR}_0`)).toBeInTheDocument();
      });

      fireEvent.click(document.getElementById(`${CDEP_BUTTON_EDITAR}_0`)!);

      expect(screen.getByTestId('modal-adicionar-acervo')).toBeInTheDocument();
      expect(screen.getByTestId('initial-item-titulo')).toHaveTextContent('Livro de História');
    });

    it('deve cancelar item de atendimento ao clicar em Cancelar item', async () => {
      (acervoSolicitacaoService.cancelarItemAtendimento as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
      });

      renderComponent();

      await waitFor(() => {
        expect(document.getElementById(`${CDEP_BUTTON_REMOVER_ACERVO}_0`)).toBeInTheDocument();
      });

      fireEvent.click(document.getElementById(`${CDEP_BUTTON_REMOVER_ACERVO}_0`)!);

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({ content: DESEJA_CANCELAR_ITEM }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      await confirmCall.onOk();

      expect(acervoSolicitacaoService.cancelarItemAtendimento).toHaveBeenCalledWith(1);
      expect(notification.success).toHaveBeenCalledWith(
        expect.objectContaining({ description: 'Item cancelado com sucesso' }),
      );
    });
  });

  describe('Ações do Cabeçalho da Página', () => {
    it('deve voltar diretamente quando botão finalizar desabilitado e sem alterações', async () => {
      mockParams = { id: undefined };
      renderComponent();

      fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR)!);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
    });

    it('deve exibir confirmação ao voltar quando campos foram tocados em solicitação não confirmada', async () => {
      mockParams = { id: undefined };
      renderComponent();

      const inputSearch = screen.getByPlaceholderText('Informe o RF ou CPF');
      fireEvent.change(inputSearch, { target: { value: '111' } });

      fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR)!);

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({ content: DESEJA_SAIR_MODO_EDICAO }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      confirmCall.onOk();

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
    });

    it('deve exibir confirmação com salvamento ao voltar quando itens foram alterados em solicitação já confirmada', async () => {
      (acervoSolicitacaoService.alterarAtendimentoManual as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Livro de História')).toBeInTheDocument();
      });

      // Adiciona um item para alterar os itens
      fireEvent.click(document.getElementById(CDEP_BUTTON_ADICIONAR_ACERVOS)!);
      fireEvent.click(screen.getByTestId('btn-adicionar-item-mock'));

      fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR)!);

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_SAIR_MODO_EDICAO_CONFIRMANDO_ITENS_SOLICITACAO_ALTERADOS,
        }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      confirmCall.onOk();

      await waitFor(() => {
        expect(acervoSolicitacaoService.alterarAtendimentoManual).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
      });
    });

    it('deve acionar onClickVoltarFinalizacao quando botaoFinalizarDesabilitado for false', async () => {
      (
        acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock
      ).mockResolvedValueOnce({
        sucesso: true,
        dados: {
          ...mockDetalhesSolicitacao.dados,
          itens: [
            {
              id: 1,
              acervoId: 100,
              tipoAcervoId: TipoAcervo.Bibliografico,
              situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO,
              tipoAtendimento: TipoAtendimentoEnum.Presencial,
              dataVisita: '2026-05-15 14:00',
              dataVisitaFormatada: '15/05/2026 14:00',
              dataEmprestimo: '2026-05-15',
              dataDevolucao: '2026-05-25',
            },
          ],
        },
      });

      renderComponent();

      await waitFor(() => {
        expect(document.getElementById(CDEP_BUTTON_FINALIZAR)).not.toBeDisabled();
      });

      fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR)!);

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_SAIR_MODO_EDICAO_FINALIZANDO_ATENDIMENTO,
        }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      confirmCall.onOk();

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
    });

    it('deve voltar diretamente no onClickVoltarFinalizacao se houver item sem data de visita', async () => {
      (
        acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock
      ).mockResolvedValueOnce({
        sucesso: true,
        dados: {
          ...mockDetalhesSolicitacao.dados,
          itens: [
            {
              id: 1,
              acervoId: 100,
              tipoAcervoId: TipoAcervo.Bibliografico,
              situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO,
              tipoAtendimento: TipoAtendimentoEnum.Presencial,
              dataVisita: null,
            },
          ],
        },
      });

      renderComponent();

      await waitFor(() => {
        expect(document.getElementById(CDEP_BUTTON_FINALIZAR)).not.toBeDisabled();
      });

      fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR)!);

      expect(confirmacao).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
    });

    it('deve resetar o formulário ao clicar em Cancelar quando campos foram tocados', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Livro de História')).toBeInTheDocument();
      });

      const inputSearch = screen.getByPlaceholderText('Informe o RF ou CPF');
      fireEvent.change(inputSearch, { target: { value: '999' } });

      const btnCancelar = document.getElementById(CDEP_BUTTON_CANCELAR)!;
      expect(btnCancelar).not.toBeDisabled();
      fireEvent.click(btnCancelar);

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({ content: DESEJA_CANCELAR_ALTERACOES }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      confirmCall.onOk();
    });

    it('deve finalizar atendimento ao clicar no botão Finalizar', async () => {
      (acervoSolicitacaoService.finalizarAtendimento as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
      });

      renderComponent();

      await waitFor(() => {
        expect(document.getElementById(CDEP_BUTTON_FINALIZAR)).not.toBeDisabled();
      });

      fireEvent.click(document.getElementById(CDEP_BUTTON_FINALIZAR)!);

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({ content: DESEJA_FINALIZAR_ATENDIMENTO }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      confirmCall.onOk();

      await waitFor(() => {
        expect(acervoSolicitacaoService.finalizarAtendimento).toHaveBeenCalledWith(123);
        expect(notification.success).toHaveBeenCalledWith(
          expect.objectContaining({ description: 'Atendimento finalizado com sucesso' }),
        );
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
      });
    });

    it('deve alterar atendimento manual existente ao clicar em Confirmar', async () => {
      (acervoSolicitacaoService.alterarAtendimentoManual as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Livro de História')).toBeInTheDocument();
      });

      // Altera os itens adicionando um novo item para habilitar confirmar
      fireEvent.click(document.getElementById(CDEP_BUTTON_ADICIONAR_ACERVOS)!);
      fireEvent.click(screen.getByTestId('btn-adicionar-item-mock'));

      const btnConfirmar = document.getElementById(CDEP_BUTTON_CONFIRMAR)!;
      expect(btnConfirmar).not.toBeDisabled();
      fireEvent.click(btnConfirmar);

      await waitFor(() => {
        expect(acervoSolicitacaoService.alterarAtendimentoManual).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 123,
            usuarioId: 10,
          }),
        );
        expect(notification.success).toHaveBeenCalledWith(
          expect.objectContaining({ description: 'Atendimento confirmado com sucesso' }),
        );
        expect(
          acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId,
        ).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Branches adicionais e permissões', () => {
    it('deve desabilitar campos e botões quando desabilitarCampos for true', async () => {
      renderComponent(true);

      await waitFor(() => {
        expect(document.getElementById(CDEP_BUTTON_ADICIONAR_ACERVOS)).toBeDisabled();
        expect(document.getElementById(CDEP_BUTTON_FINALIZAR)).toBeDisabled();
      });
    });

    it('não deve quebrar se obterDetalhes retornar sucesso false', async () => {
      (
        acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock
      ).mockResolvedValueOnce({
        sucesso: false,
      });

      renderComponent();

      await waitFor(() => {
        expect(
          acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId,
        ).toHaveBeenCalled();
      });

      expect(screen.queryByText('Livro de História')).not.toBeInTheDocument();
    });

    it('não deve disparar notificações quando as requisições retornarem sucesso false', async () => {
      (acervoSolicitacaoService.cancelarItemAtendimento as jest.Mock).mockResolvedValueOnce({
        sucesso: false,
      });
      (acervoSolicitacaoService.finalizarAtendimento as jest.Mock).mockResolvedValueOnce({
        sucesso: false,
      });
      (acervoSolicitacaoService.alterarAtendimentoManual as jest.Mock).mockResolvedValueOnce({
        sucesso: false,
      });

      renderComponent();

      await waitFor(() => {
        expect(document.getElementById(`${CDEP_BUTTON_REMOVER_ACERVO}_0`)).toBeInTheDocument();
      });

      // Cancelar item com sucesso false
      fireEvent.click(document.getElementById(`${CDEP_BUTTON_REMOVER_ACERVO}_0`)!);
      let confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      await confirmCall.onOk();

      // Finalizar atendimento com sucesso false
      fireEvent.click(document.getElementById(CDEP_BUTTON_FINALIZAR)!);
      confirmCall = (confirmacao as jest.Mock).mock.calls[1][0];
      confirmCall.onOk();

      // Confirmar atendimento com sucesso false
      fireEvent.click(document.getElementById(CDEP_BUTTON_ADICIONAR_ACERVOS)!);
      fireEvent.click(screen.getByTestId('btn-adicionar-item-mock'));
      fireEvent.click(document.getElementById(CDEP_BUTTON_CONFIRMAR)!);

      await waitFor(() => {
        expect(acervoSolicitacaoService.alterarAtendimentoManual).toHaveBeenCalled();
      });

      expect(notification.success).not.toHaveBeenCalled();
    });
  });
});
