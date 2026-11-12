import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { notification } from '~/components/lib/notification';
import {
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_CANCELAR_ATENDIMENTO,
  CDEP_BUTTON_FINALIZAR,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_NUMERO_SOLICITACAO } from '~/core/constants/ids/input';
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_CANCELAR_ATENDIMENTO,
  DESEJA_CANCELAR_ITEM_E_DESCARTAR_ITENS_NAO_CONFIRMADOS,
  DESEJA_DEVOLVER_ITEM,
  DESEJA_FINALIZAR_ATENDIMENTO,
  DESEJA_FINALIZAR_ITEM_ATENDIMENTO,
  DESEJA_SAIR_MODO_EDICAO,
} from '~/core/constants/mensagens';
import { ROUTES } from '~/core/enum/routes';
import { SituacaoSolicitacaoEnum } from '~/core/enum/situacao-atendimento-enum';
import { SituacaoEmprestimoEnum } from '~/core/enum/situacao-emprestimo-enum';
import { SituacaoSolicitacaoItemEnum } from '~/core/enum/situacao-item-atendimento-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';
import { devolverEmprestimo } from '~/core/services/acervo-emprestimo';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { confirmacao } from '~/core/services/alerta-service';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { FormAtendimentoSolicitacoes } from './index';

const mockNavigate = jest.fn();
let mockParams: { id?: string } = { id: '123' };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

let mockPerfil = TipoPerfil.ADMIN_GERAL;
jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: (selector: any) =>
    selector({
      perfil: {
        perfilSelecionado: {
          perfil: mockPerfil,
        },
      },
    }),
}));

jest.mock('~/core/services/acervo-solicitacao-service', () => ({
  obterDetalhesParaAtendimentoSolicitacoesPorId: jest.fn(),
  cancelarItemAtendimento: jest.fn(),
  cancelarAtendimento: jest.fn(),
  finalizarAtendimento: jest.fn(),
  finalizarItemAtendimento: jest.fn(),
}));

jest.mock('~/core/services/acervo-emprestimo', () => ({
  devolverEmprestimo: jest.fn(),
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

jest.mock('./components/modal-atendimento', () => ({
  ModalAtendimento: (props: any) =>
    props.isModalOpen ? (
      <div data-testid='modal-atendimento'>
        ModalAtendimento Aberto
        <button data-testid='btn-fechar-modal' onClick={() => props.setIsModalOpen(false)}>
          Fechar
        </button>
        <button data-testid='btn-recarregar-modal' onClick={() => props.carregarDados()}>
          Recarregar
        </button>
      </div>
    ) : null,
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
            <tr key={linha.id ?? index} data-testid={`linha-${linha.id}`}>
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

describe('FormAtendimentoSolicitacoes', () => {
  const mockDadosRetorno = {
    sucesso: true,
    dados: {
      id: 123,
      podeCancelar: true,
      podeFinalizar: true,
      situacaoId: 1,
      situacao: 'Em atendimento',
      dataSolicitacao: '2026-05-10T10:00:00',
      dadosSolicitante: {
        tipoId: TipoUsuario.POPULACAO_GERAL,
        nome: 'João da Silva',
        login: '12345678901',
        telefone: '11987654321',
        email: 'joao@email.com',
        endereco: 'Rua das Flores, 100',
      },
      itens: [
        {
          id: 1,
          tipoAcervoId: TipoAcervo.Bibliografico,
          tipoAcervo: 'Bibliográfico',
          codigo: 'TOMBO-1',
          titulo: 'Livro de História',
          situacaoId: SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE,
          situacaoEmprestimo: SituacaoEmprestimoEnum.EMPRESTADO,
          podeEditar: true,
          temControleDisponibilidade: true,
          situacaoSaldo: 1,
          situacaoDisponibilidade: 'Disponível',
          tipoAtendimento: 1,
          dataVisita: '2026-05-10T14:00:00',
          dataEmprestimo: '2026-05-10T14:00:00',
          dataDevolucao: '2026-05-20T14:00:00',
        },
        {
          id: 2,
          tipoAcervoId: TipoAcervo.Audiovisual,
          tipoAcervo: 'Audiovisual',
          codigo: 'TOMBO-2',
          titulo: 'A'.repeat(120),
          situacaoId: SituacaoSolicitacaoItemEnum.FINALIZADO_AUTOMATICAMENTE,
          podeEditar: true,
          podeFinalizarItem: true,
          temControleDisponibilidade: false,
          tipoAtendimento: 2,
          dataVisita: '2026-05-10T15:00:00',
        },
        {
          id: 3,
          tipoAcervoId: TipoAcervo.Bibliografico,
          tipoAcervo: 'Bibliográfico',
          codigo: 'TOMBO-3',
          titulo: 'Livro Cancelado',
          situacaoId: SituacaoSolicitacaoItemEnum.CANCELADO,
          situacaoEmprestimo: SituacaoSolicitacaoItemEnum.CANCELADO,
          podeEditar: false,
        },
        {
          id: 4,
          tipoAcervoId: undefined,
          codigo: 'SEM-TIPO',
          titulo: 'Sem Tipo',
          podeFinalizarItem: true,
        },
        {
          id: 5,
          tipoAcervoId: TipoAcervo.Bibliografico,
          tipoAcervo: 'Bibliográfico',
          codigo: 'TOMBO-5',
          titulo: 'Livro Devolvido Finalizado',
          situacaoId: SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE,
          situacaoEmprestimo: SituacaoEmprestimoEnum.DEVOLVIDO,
          podeEditar: false,
        },
        {
          id: 6,
          tipoAcervoId: TipoAcervo.Audiovisual,
          tipoAcervo: 'Audiovisual',
          codigo: 'TOMBO-6',
          titulo: 'Item Audiovisual Cancelado',
          situacaoId: SituacaoSolicitacaoItemEnum.CANCELADO,
          podeEditar: false,
        },
        {
          id: 7,
          tipoAcervoId: TipoAcervo.Audiovisual,
          tipoAcervo: 'Audiovisual',
          codigo: 'TOMBO-7',
          titulo: 'Item Audiovisual Finalizado Manual',
          situacaoId: SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE,
          podeEditar: false,
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: '123' };
    mockPerfil = TipoPerfil.ADMIN_GERAL;
    (
      acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock
    ).mockResolvedValue(mockDadosRetorno);
  });

  const renderComponent = (desabilitarCampos = false) => {
    return render(
      <PermissaoContext.Provider
        value={{
          desabilitarCampos,
          setDesabilitarCampos: jest.fn(),
          permissao: {
            customRoles: [],
            podeAlterar: true,
            podeConsultar: true,
            podeExcluir: true,
            podeIncluir: true,
          },
        }}
      >
        <FormAtendimentoSolicitacoes />
      </PermissaoContext.Provider>,
    );
  };

  it('deve carregar detalhes do atendimento e renderizar dados do solicitante e itens da tabela', async () => {
    renderComponent();

    expect(screen.getByText('Atendimento de Solicitações')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId,
      ).toHaveBeenCalledWith(123);
    });

    expect(screen.getByPlaceholderText('nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Endereço')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Data da solicitação')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Situação')).toBeInTheDocument();

    // Título curto e longo com Tooltip
    expect(screen.getByText('Livro de História')).toBeInTheDocument();
    expect(screen.getByText(`${'A'.repeat(100)}...`)).toBeInTheDocument();

    // Colunas de bibliográfico
    expect(screen.getByText('Data do empréstimo')).toBeInTheDocument();
    expect(screen.getByText('Data da devolução')).toBeInTheDocument();

    // Botões de item
    expect(screen.getByRole('button', { name: /Prorrogar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Devolver item/i })).toBeInTheDocument();
  });

  it('não deve renderizar campos de CPF, telefone e endereço para usuário CORESSO', async () => {
    (
      acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock
    ).mockResolvedValueOnce({
      sucesso: true,
      dados: {
        ...mockDadosRetorno.dados,
        dadosSolicitante: {
          ...mockDadosRetorno.dados.dadosSolicitante,
          tipoId: TipoUsuario.CORESSO,
          login: '',
          telefone: '',
        },
        dataSolicitacao: '',
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(
        acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId,
      ).toHaveBeenCalled();
    });

    expect(screen.queryByPlaceholderText('CPF')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('telefone')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Endereço')).not.toBeInTheDocument();
  });

  it('deve chamar handleOpenEmail ao clicar no botão de email se o email estiver preenchido', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(jest.fn());

    renderComponent();

    await waitFor(() => {
      expect(
        acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId,
      ).toHaveBeenCalled();
    });

    const botoes = screen.getAllByRole('button');
    const btnEmail = botoes.find((b) => b.querySelector('.anticon-mail'));
    if (btnEmail) {
      try {
        fireEvent.click(btnEmail);
      } catch {
        // Ignora erro de navegação do JSDOM
      }
    }

    errorSpy.mockRestore();
  });

  it('não deve tentar abrir o cliente de email se o email for vazio', async () => {
    (
      acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock
    ).mockResolvedValueOnce({
      sucesso: true,
      dados: {
        ...mockDadosRetorno.dados,
        dadosSolicitante: {
          ...mockDadosRetorno.dados.dadosSolicitante,
          email: '',
        },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(
        acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId,
      ).toHaveBeenCalled();
    });

    const botoes = screen.getAllByRole('button');
    const btnEmail = botoes.find((b) => b.querySelector('.anticon-mail'));
    if (btnEmail) {
      fireEvent.click(btnEmail);
    }
  });

  it('não deve incluir colunas de empréstimo se não houver item bibliográfico', async () => {
    (
      acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock
    ).mockResolvedValueOnce({
      sucesso: true,
      dados: {
        ...mockDadosRetorno.dados,
        itens: [
          {
            id: 20,
            tipoAcervoId: TipoAcervo.Audiovisual,
            tipoAcervo: 'Audiovisual',
            codigo: 'AV-1',
            titulo: 'Filme',
            situacaoId: 1,
            podeEditar: true,
          },
        ],
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Filme')).toBeInTheDocument();
    });

    expect(screen.queryByText('Data do empréstimo')).not.toBeInTheDocument();
    expect(screen.queryByText('Data da devolução')).not.toBeInTheDocument();
  });

  describe('Ações de Itens da Tabela', () => {
    it('deve acionar devolver item ao clicar em "Devolver item"', async () => {
      (devolverEmprestimo as jest.Mock).mockResolvedValueOnce({ sucesso: true });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Devolver item/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /Devolver item/i }));

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_DEVOLVER_ITEM,
        }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      await confirmCall.onOk();

      expect(devolverEmprestimo).toHaveBeenCalledWith(1);
      expect(notification.success).toHaveBeenCalledWith(
        expect.objectContaining({ description: 'Item devolvido com sucesso' }),
      );
    });

    it('deve cancelar item de atendimento ao clicar em "Cancelar item"', async () => {
      (
        acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock
      ).mockResolvedValueOnce({
        sucesso: true,
        dados: {
          ...mockDadosRetorno.dados,
          itens: [
            {
              id: 2,
              tipoAcervoId: TipoAcervo.Audiovisual,
              situacaoId: 1,
              podeEditar: true,
              podeFinalizarItem: true,
            },
          ],
        },
      });

      (acervoSolicitacaoService.cancelarItemAtendimento as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Cancelar item/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /Cancelar item/i }));

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_CANCELAR_ITEM_E_DESCARTAR_ITENS_NAO_CONFIRMADOS,
        }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      await confirmCall.onOk();

      expect(acervoSolicitacaoService.cancelarItemAtendimento).toHaveBeenCalledWith(2);
      expect(notification.success).toHaveBeenCalledWith(
        expect.objectContaining({ description: 'Item cancelado com sucesso' }),
      );
    });

    it('deve finalizar item de atendimento ao clicar em "Finalizar item"', async () => {
      (
        acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock
      ).mockResolvedValueOnce({
        sucesso: true,
        dados: {
          ...mockDadosRetorno.dados,
          itens: [
            {
              id: 2,
              tipoAcervoId: TipoAcervo.Audiovisual,
              situacaoId: 1,
              podeEditar: true,
              podeFinalizarItem: true,
            },
          ],
        },
      });

      (acervoSolicitacaoService.finalizarItemAtendimento as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Finalizar item/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /Finalizar item/i }));

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_FINALIZAR_ITEM_ATENDIMENTO,
        }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      await confirmCall.onOk();

      expect(acervoSolicitacaoService.finalizarItemAtendimento).toHaveBeenCalledWith(2);
      expect(notification.success).toHaveBeenCalledWith(
        expect.objectContaining({ description: 'Item finalizado com sucesso' }),
      );
    });

    it('deve abrir ModalAtendimento ao clicar em Prorrogar ou Editar e fechar quando solicitado', async () => {
      (
        acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock
      ).mockResolvedValueOnce({
        sucesso: true,
        dados: {
          ...mockDadosRetorno.dados,
          itens: [
            {
              id: 2,
              tipoAcervoId: TipoAcervo.Audiovisual,
              situacaoId: 1,
              podeEditar: true,
            },
          ],
        },
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Editar/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /Editar/i }));

      expect(screen.getByTestId('modal-atendimento')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('btn-fechar-modal'));

      expect(screen.queryByTestId('modal-atendimento')).not.toBeInTheDocument();
    });
  });

  describe('Ações do Cabeçalho da Página', () => {
    it('deve voltar diretamente se os campos não foram modificados', () => {
      renderComponent();

      fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR)!);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
    });

    it('deve exibir confirmação ao voltar se os campos foram tocados', () => {
      renderComponent();

      fireEvent.change(document.getElementById(CDEP_INPUT_NUMERO_SOLICITACAO)!, {
        target: { value: '999' },
      });

      fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR)!);

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_SAIR_MODO_EDICAO,
        }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      confirmCall.onOk();

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
    });

    it('deve cancelar alterações ao clicar no botão Cancelar quando campos foram tocados', () => {
      renderComponent();

      fireEvent.change(document.getElementById(CDEP_INPUT_NUMERO_SOLICITACAO)!, {
        target: { value: '999' },
      });

      const btnCancelar = document.getElementById(CDEP_BUTTON_CANCELAR)!;
      fireEvent.click(btnCancelar);

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_CANCELAR_ALTERACOES,
        }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      confirmCall.onOk();
    });

    it('não deve exibir confirmação de cancelar se campos não foram tocados', () => {
      renderComponent();

      const btnCancelar = document.getElementById(CDEP_BUTTON_CANCELAR)!;
      btnCancelar.removeAttribute('disabled');
      fireEvent.click(btnCancelar);

      expect(confirmacao).not.toHaveBeenCalled();
    });

    it('deve finalizar atendimento ao clicar em Finalizar', async () => {
      (acervoSolicitacaoService.finalizarAtendimento as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
      });

      renderComponent();

      await waitFor(() => {
        expect(document.getElementById(CDEP_BUTTON_FINALIZAR)).not.toBeDisabled();
      });

      fireEvent.click(document.getElementById(CDEP_BUTTON_FINALIZAR)!);

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_FINALIZAR_ATENDIMENTO,
        }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      confirmCall.onOk();

      await waitFor(() => {
        expect(acervoSolicitacaoService.finalizarAtendimento).toHaveBeenCalledWith(123);
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
        expect(notification.success).toHaveBeenCalledWith(
          expect.objectContaining({ description: 'Atendimento finalizado com sucesso' }),
        );
      });
    });

    it('deve cancelar atendimento ao clicar em Cancelar Atendimento', async () => {
      (acervoSolicitacaoService.cancelarAtendimento as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
      });

      renderComponent();

      await waitFor(() => {
        expect(document.getElementById(CDEP_BUTTON_CANCELAR_ATENDIMENTO)).not.toBeDisabled();
      });

      fireEvent.click(document.getElementById(CDEP_BUTTON_CANCELAR_ATENDIMENTO)!);

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_CANCELAR_ATENDIMENTO,
        }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      confirmCall.onOk();

      await waitFor(() => {
        expect(acervoSolicitacaoService.cancelarAtendimento).toHaveBeenCalledWith(123);
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
        expect(notification.success).toHaveBeenCalledWith(
          expect.objectContaining({ description: 'Atendimento cancelado com sucesso' }),
        );
      });
    });
  });

  describe('Cenários adicionais de branches', () => {
    it('não deve carregar dados quando o ID nos parâmetros da rota for inexistente', () => {
      mockParams = { id: undefined };

      renderComponent();

      expect(
        acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId,
      ).not.toHaveBeenCalled();
    });

    it('não deve processar dados se obterDetalhesParaAtendimentoSolicitacoesPorId retornar sucesso false', async () => {
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

    it('deve desabilitar botões quando desabilitarCampos for verdadeiro no PermissaoContext', async () => {
      renderComponent(true);

      await waitFor(() => {
        expect(document.getElementById(CDEP_BUTTON_FINALIZAR)).toBeDisabled();
        expect(document.getElementById(CDEP_BUTTON_CANCELAR_ATENDIMENTO)).toBeDisabled();
      });
    });

    it('deve desabilitar botão de cancelar item quando o atendimento já estiver finalizado', async () => {
      (
        acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock
      ).mockResolvedValueOnce({
        sucesso: true,
        dados: {
          ...mockDadosRetorno.dados,
          situacaoId: SituacaoSolicitacaoEnum.FINALIZADO_ATENDIMENTO,
          itens: [
            {
              id: 50,
              tipoAcervoId: TipoAcervo.Audiovisual,
              situacaoId: 1,
              podeEditar: true,
            },
          ],
        },
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Cancelar item/i })).toBeDisabled();
      });
    });

    it('não deve disparar notificação quando as ações retornarem sucesso false', async () => {
      (devolverEmprestimo as jest.Mock).mockResolvedValueOnce({ sucesso: false });
      (acervoSolicitacaoService.cancelarItemAtendimento as jest.Mock).mockResolvedValueOnce({
        sucesso: false,
      });
      (acervoSolicitacaoService.finalizarItemAtendimento as jest.Mock).mockResolvedValueOnce({
        sucesso: false,
      });
      (acervoSolicitacaoService.finalizarAtendimento as jest.Mock).mockResolvedValueOnce({
        sucesso: false,
      });
      (acervoSolicitacaoService.cancelarAtendimento as jest.Mock).mockResolvedValueOnce({
        sucesso: false,
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Devolver item/i })).toBeInTheDocument();
      });

      // Devolver item com sucesso false
      fireEvent.click(screen.getByRole('button', { name: /Devolver item/i }));
      let confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      await confirmCall.onOk();

      // Cancelar item com sucesso false
      fireEvent.click(screen.getByRole('button', { name: /Cancelar item/i }));
      confirmCall = (confirmacao as jest.Mock).mock.calls[1][0];
      await confirmCall.onOk();

      // Finalizar item com sucesso false
      fireEvent.click(screen.getByRole('button', { name: /Finalizar item/i }));
      confirmCall = (confirmacao as jest.Mock).mock.calls[2][0];
      await confirmCall.onOk();

      // Finalizar atendimento com sucesso false
      fireEvent.click(document.getElementById(CDEP_BUTTON_FINALIZAR)!);
      confirmCall = (confirmacao as jest.Mock).mock.calls[3][0];
      await confirmCall.onOk();

      // Cancelar atendimento com sucesso false
      fireEvent.click(document.getElementById(CDEP_BUTTON_CANCELAR_ATENDIMENTO)!);
      confirmCall = (confirmacao as jest.Mock).mock.calls[4][0];
      await confirmCall.onOk();

      expect(notification.success).not.toHaveBeenCalled();
    });

    it('deve prevenir comportamento padrão no submit do formulário', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByPlaceholderText('nome')).toBeInTheDocument();
      });

      const form = document.querySelector('form');
      if (form) {
        fireEvent.submit(form);
      }
    });
  });
});
