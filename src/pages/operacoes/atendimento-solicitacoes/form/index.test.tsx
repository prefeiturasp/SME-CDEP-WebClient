import { AnyAction, configureStore, Reducer } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { notification } from '~/components/lib/notification';
import {
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_CANCELAR_ATENDIMENTO,
  CDEP_BUTTON_CANCELAR_ITEM_SOLICITACAO,
  CDEP_BUTTON_DEVOLVER_ITEM,
  CDEP_BUTTON_EDITAR,
  CDEP_BUTTON_FINALIZAR,
  CDEP_BUTTON_FINALIZAR_ITEM,
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
import { AcervoSolicitacaoDetalheDTO } from '~/core/dto/acervo-solicitacao-detalhe-dto';
import { PerfilUsuarioDTO } from '~/core/dto/perfil-usuario-dto';
import { AcervoDisponibilidadeSituacaoEnum } from '~/core/enum/acervo-disponibilidade-enum';
import { ROUTES } from '~/core/enum/routes';
import { SituacaoSolicitacaoEnum } from '~/core/enum/situacao-atendimento-enum';
import { SituacaoEmprestimoEnum } from '~/core/enum/situacao-emprestimo-enum';
import { SituacaoSolicitacaoItemEnum } from '~/core/enum/situacao-item-atendimento-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoAtendimentoEnum } from '~/core/enum/tipo-atendimento-enum';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';
import perfilReducer from '~/core/redux/modules/perfil/reducers';
import { devolverEmprestimo } from '~/core/services/acervo-emprestimo';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { confirmacao } from '~/core/services/alerta-service';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { FormAtendimentoSolicitacoes } from './index';

const mockNavigate = jest.fn();
const mockUseParams = jest.fn(() => ({ id: '55' } as { id?: string }));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

jest.mock('query-string', () => ({
  __esModule: true,
  default: {
    stringify: jest.fn(() => 'mock'),
  },
}));

jest.mock('antd/es/table', () => jest.requireActual('antd/lib/table'));
jest.mock('antd/es/form/Form', () => jest.requireActual('antd/lib/form/Form'));
jest.mock('antd/es/select', () => jest.requireActual('antd/lib/select'));
jest.mock('antd/es/date-picker/locale/pt_BR', () =>
  jest.requireActual('antd/lib/date-picker/locale/pt_BR'),
);

jest.mock('~/components/lib/button/secundary', () => {
  const ActualButtonSecundary = jest.requireActual('~/components/lib/button/secundary').default;
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => (
      <>
        <ActualButtonSecundary {...props} />
        {props.id === 'CDEP_BUTTON_CANCELAR' ? (
          <button
            type='button'
            data-testid='force-click-cancelar'
            style={{ display: 'none' }}
            onClick={props.onClick as () => void}
          />
        ) : null}
      </>
    ),
  };
});

jest.mock('./components/modal-atendimento', () => ({
  ModalAtendimento: ({
    isModalOpen,
    setIsModalOpen,
    initialValuesModal,
    acervoSolicitacaoId,
  }: {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    initialValuesModal?: { id?: number; titulo?: string };
    acervoSolicitacaoId: number;
  }) =>
    isModalOpen ? (
      <div data-testid='mock-modal-atendimento'>
        <span>{`Modal Aberto - Solicitacao ${acervoSolicitacaoId} - Item ${initialValuesModal?.id}`}</span>
        <button type='button' onClick={() => setIsModalOpen(false)}>
          Fechar Mock Modal
        </button>
      </div>
    ) : null,
}));

jest.mock('~/core/services/acervo-solicitacao-service', () => ({
  __esModule: true,
  default: {
    obterDetalhesParaAtendimentoSolicitacoesPorId: jest.fn(),
    cancelarItemAtendimento: jest.fn(),
    cancelarAtendimento: jest.fn(),
    finalizarAtendimento: jest.fn(),
    finalizarItemAtendimento: jest.fn(),
  },
}));

jest.mock('~/core/services/acervo-emprestimo', () => ({
  __esModule: true,
  devolverEmprestimo: jest.fn(),
}));

jest.mock('~/core/services/alerta-service', () => ({
  __esModule: true,
  confirmacao: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
  },
}));

type PerfilStorageState = {
  perfis: PerfilUsuarioDTO[];
  perfilSelecionado: PerfilUsuarioDTO | null;
};

const mockedObterDetalhes =
  acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock;
const mockedCancelarItem = acervoSolicitacaoService.cancelarItemAtendimento as jest.Mock;
const mockedCancelarAtendimento = acervoSolicitacaoService.cancelarAtendimento as jest.Mock;
const mockedFinalizarAtendimento = acervoSolicitacaoService.finalizarAtendimento as jest.Mock;
const mockedFinalizarItem = acervoSolicitacaoService.finalizarItemAtendimento as jest.Mock;
const mockedDevolverEmprestimo = devolverEmprestimo as jest.Mock;
const mockedConfirmacao = confirmacao as jest.Mock;
const mockedNotificationSuccess = notification.success as jest.Mock;

const tituloLongo = 'Título Histórico Muito Longo '.repeat(5);

const detalhesExternoBase: AcervoSolicitacaoDetalheDTO = {
  id: 55,
  usuarioId: 10,
  dataSolicitacao: '2026-10-01T10:00:00',
  situacao: 'Aguardando atendimento',
  situacaoId: SituacaoSolicitacaoEnum.AGUARDANDO_ATENDIMENTO,
  podeCancelar: true,
  podeFinalizar: true,
  dadosSolicitante: {
    id: 10,
    nome: 'Pesquisadora Ana',
    login: '12345678901',
    telefone: '11987654321',
    endereco: 'Rua da Consolação, 500',
    email: 'ana@teste.com',
    tipo: 'Estudante',
    tipoId: TipoUsuario.ESTUDANTE,
  },
  itens: [
    {
      id: 1,
      acervoId: 101,
      codigo: 'B-001',
      titulo: 'Livro Disponível',
      tipoAcervo: 'Bibliográfico',
      tipoAcervoId: TipoAcervo.Bibliografico,
      responsavel: 'Resp 1',
      situacao: 'Aguardando atendimento',
      situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO,
      tipoAtendimento: TipoAtendimentoEnum.Email,
      dataVisita: '2026-10-15T14:00:00',
      dataEmprestimo: '2026-10-15T14:00:00',
      dataDevolucao: '2026-10-22T14:00:00',
      situacaoDisponibilidade: 'Disponível',
      situacaoSaldo: AcervoDisponibilidadeSituacaoEnum.DISPONIVEL,
      temControleDisponibilidade: true,
      podeEditar: true,
      podeFinalizarItem: true,
    },
    {
      id: 2,
      acervoId: 102,
      codigo: 'B-002',
      titulo: tituloLongo,
      tipoAcervo: 'Bibliográfico',
      tipoAcervoId: TipoAcervo.Bibliografico,
      responsavel: 'Resp 2',
      situacao: 'Finalizado manualmente',
      situacaoId: SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE,
      tipoAtendimento: TipoAtendimentoEnum.Presencial,
      situacaoEmprestimo: SituacaoEmprestimoEnum.EMPRESTADO,
      temControleDisponibilidade: false,
      podeEditar: true,
    },
    {
      id: 3,
      acervoId: 103,
      codigo: 'F-003',
      titulo: 'Foto Cancelada',
      tipoAcervo: 'Fotográfico',
      tipoAcervoId: TipoAcervo.Fotografico,
      responsavel: 'Resp 3',
      situacao: 'Cancelado',
      situacaoId: SituacaoSolicitacaoItemEnum.CANCELADO,
      tipoAtendimento: TipoAtendimentoEnum.Email,
    },
    {
      id: 4,
      acervoId: 104,
      codigo: 'D-004',
      titulo: 'Documento Finalizado Auto',
      tipoAcervo: 'Documentação histórica',
      tipoAcervoId: TipoAcervo.DocumentacaoTextual,
      responsavel: 'Resp 4',
      situacao: 'Finalizado automaticamente',
      situacaoId: SituacaoSolicitacaoItemEnum.FINALIZADO_AUTOMATICAMENTE,
      tipoAtendimento: TipoAtendimentoEnum.Email,
    },
    {
      id: 5,
      acervoId: 105,
      codigo: 'X-005',
      titulo: 'Item Sem TipoAcervoId',
      situacao: 'Aguardando',
      situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO,
      situacaoEmprestimo: SituacaoEmprestimoEnum.DEVOLVIDO,
    },
  ],
};

const renderPage = ({
  desabilitarCampos = false,
  perfilSelecionado = {
    perfil: TipoPerfil.ADMIN_GERAL,
    perfilNome: 'Admin Geral',
  },
}: {
  desabilitarCampos?: boolean;
  perfilSelecionado?: PerfilUsuarioDTO | null;
} = {}) => {
  const store = configureStore({
    reducer: {
      perfil: perfilReducer as unknown as Reducer<PerfilStorageState, AnyAction>,
    },
    preloadedState: {
      perfil: {
        perfis: [],
        perfilSelecionado,
      },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
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
              somenteConsulta: false,
            },
          }}
        >
          <FormAtendimentoSolicitacoes />
        </PermissaoContext.Provider>
      </MemoryRouter>
    </Provider>,
  );
};

describe('FormAtendimentoSolicitacoes (src/pages/operacoes/atendimento-solicitacoes/form/index.tsx)', () => {
  jest.setTimeout(60000);

  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseParams.mockReturnValue({ id: '55' });
    mockedObterDetalhes.mockReset();
    mockedCancelarItem.mockReset();
    mockedCancelarAtendimento.mockReset();
    mockedFinalizarAtendimento.mockReset();
    mockedFinalizarItem.mockReset();
    mockedDevolverEmprestimo.mockReset();
    mockedConfirmacao.mockReset();
    mockedNotificationSuccess.mockReset();
  });

  it('C10 e C11: deve carregar detalhes para usuário externo, interno (CORESSO), sem ID (0), resposta falha e tratar mailto', async () => {
    // 1. Sem ID na rota -> não busca detalhes
    mockUseParams.mockReturnValue({});
    const { unmount: unmountSemId } = renderPage();
    expect(mockedObterDetalhes).not.toHaveBeenCalled();
    unmountSemId();

    // 2. Resposta sucesso = false
    mockUseParams.mockReturnValue({ id: '55' });
    mockedObterDetalhes.mockResolvedValueOnce({ sucesso: false });
    const { unmount: unmountFalha } = renderPage();
    await waitFor(() => expect(mockedObterDetalhes).toHaveBeenCalledWith(55));
    unmountFalha();

    // 3. Solicitante interno (CORESSO) sem telefone/login/dataSolicitacao e sem email (handleOpenEmail no-op)
    mockedObterDetalhes.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        ...detalhesExternoBase,
        dataSolicitacao: '',
        itens: [],
        dadosSolicitante: {
          id: 20,
          nome: 'Servidor CORESSO',
          login: '',
          telefone: '',
          endereco: '',
          email: '',
          tipo: 'Servidor SME',
          tipoId: TipoUsuario.CORESSO,
        },
      },
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(jest.fn());

    const { container: containerInterno, unmount: unmountInterno } = renderPage();
    await waitFor(() => {
      expect(screen.getByPlaceholderText('nome')).toHaveValue('Servidor CORESSO');
    });
    expect(screen.queryByPlaceholderText('CPF')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('telefone')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Endereço')).not.toBeInTheDocument();
    expect(screen.queryAllByText('Data do empréstimo')).toHaveLength(0);

    // Botão de e-mail quando e-mail está vazio não aciona navegação mailto
    const mailBtnEmpty = containerInterno.querySelector('button .anticon-mail')
      ?.parentElement as HTMLButtonElement;
    fireEvent.click(mailBtnEmpty);
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Not implemented: navigation'),
      expect.anything(),
    );
    unmountInterno();

    // 4. Solicitante externo com dados mascarados e e-mail preenchido
    mockedObterDetalhes.mockResolvedValueOnce({
      sucesso: true,
      dados: JSON.parse(JSON.stringify(detalhesExternoBase)),
    });

    const { container: containerExterno } = renderPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('CPF')).toHaveValue('123.456.789-01');
      expect(screen.getByPlaceholderText('telefone')).toHaveValue('(11) 98765-4321');
      expect(screen.getByPlaceholderText('Endereço')).toHaveValue('Rua da Consolação, 500');
      expect(screen.getByPlaceholderText('Data da solicitação')).toHaveValue('01/10/2026');
    });

    const mailBtn = containerExterno.querySelector('button .anticon-mail')
      ?.parentElement as HTMLButtonElement;
    fireEvent.click(mailBtn);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('C12, C13 e C14: deve renderizar colunas condicionais, controlar visibilidade de ações por linha e abrir ModalAtendimento', async () => {
    mockedObterDetalhes.mockResolvedValueOnce({
      sucesso: true,
      dados: JSON.parse(JSON.stringify(detalhesExternoBase)),
    });

    const { container } = renderPage();

    await waitFor(() => {
      expect(screen.getByText('Livro Disponível')).toBeInTheDocument();
    });

    // Tag de disponibilidade e colunas de empréstimo/devolução para item bibliográfico
    expect(screen.getByText('Disponível')).toBeInTheDocument();
    expect(screen.getAllByText('Data do empréstimo').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Data da devolução').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(`${tituloLongo.slice(0, 100)}...`)).toBeInTheDocument();

    // Linha 0: Editar, Cancelar item, Finalizar item
    // Linha 1 (Bibliográfico FINALIZADO_MANUALMENTE): Prorrogar e Devolver item
    expect(screen.getByRole('button', { name: /prorrogar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /devolver item/i })).toBeInTheDocument();

    // Abre modal ao clicar no botão Editar da linha 0 e fecha pelo stub
    const btnEditar0 = container.querySelector(`#${CDEP_BUTTON_EDITAR}_0`) as HTMLButtonElement;
    fireEvent.click(btnEditar0);

    expect(screen.getByTestId('mock-modal-atendimento')).toHaveTextContent(
      'Modal Aberto - Solicitacao 55 - Item 1',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Fechar Mock Modal' }));
    expect(screen.queryByTestId('mock-modal-atendimento')).not.toBeInTheDocument();
  });

  it('C15, C16 e C17: deve executar Cancelar item, Finalizar item e Devolver item via confirmação (sucesso e falha)', async () => {
    mockedObterDetalhes.mockResolvedValue({
      sucesso: true,
      dados: JSON.parse(JSON.stringify(detalhesExternoBase)),
    });

    const { container } = renderPage();

    await waitFor(() => {
      expect(screen.getByText('Livro Disponível')).toBeInTheDocument();
    });

    // 1. Cancelar item (sucesso e falha)
    const btnCancelarItem = container.querySelector(
      `#${CDEP_BUTTON_CANCELAR_ITEM_SOLICITACAO}`,
    ) as HTMLButtonElement;

    mockedConfirmacao.mockImplementation(({ onOk }: { onOk: () => void }) => onOk());
    mockedCancelarItem.mockResolvedValueOnce({ sucesso: true });
    fireEvent.click(btnCancelarItem);

    await waitFor(() => {
      expect(mockedConfirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_CANCELAR_ITEM_E_DESCARTAR_ITENS_NAO_CONFIRMADOS,
        }),
      );
      expect(mockedCancelarItem).toHaveBeenCalledWith(1);
      expect(mockedNotificationSuccess).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Item cancelado com sucesso',
      });
    });

    mockedNotificationSuccess.mockReset();
    mockedCancelarItem.mockResolvedValueOnce({ sucesso: false });
    fireEvent.click(
      container.querySelector(`#${CDEP_BUTTON_CANCELAR_ITEM_SOLICITACAO}`) as HTMLButtonElement,
    );
    await waitFor(() => expect(mockedCancelarItem).toHaveBeenCalledTimes(2));
    expect(mockedNotificationSuccess).not.toHaveBeenCalled();

    // 2. Finalizar item (sucesso e falha)
    mockedFinalizarItem.mockResolvedValueOnce({ sucesso: true });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_FINALIZAR_ITEM}`) as HTMLButtonElement);

    await waitFor(() => {
      expect(mockedConfirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_FINALIZAR_ITEM_ATENDIMENTO,
        }),
      );
      expect(mockedFinalizarItem).toHaveBeenCalledWith(1);
      expect(mockedNotificationSuccess).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Item finalizado com sucesso',
      });
    });

    mockedNotificationSuccess.mockReset();
    mockedFinalizarItem.mockResolvedValueOnce({ sucesso: false });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_FINALIZAR_ITEM}`) as HTMLButtonElement);
    await waitFor(() => expect(mockedFinalizarItem).toHaveBeenCalledTimes(2));
    expect(mockedNotificationSuccess).not.toHaveBeenCalled();

    // 3. Devolver item (sucesso e falha)
    mockedDevolverEmprestimo.mockResolvedValueOnce({ sucesso: true });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_DEVOLVER_ITEM}`) as HTMLButtonElement);

    await waitFor(() => {
      expect(mockedConfirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_DEVOLVER_ITEM,
        }),
      );
      expect(mockedDevolverEmprestimo).toHaveBeenCalledWith(2);
      expect(mockedNotificationSuccess).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Item devolvido com sucesso',
      });
    });

    mockedNotificationSuccess.mockReset();
    mockedDevolverEmprestimo.mockResolvedValueOnce({ sucesso: false });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_DEVOLVER_ITEM}`) as HTMLButtonElement);
    await waitFor(() => expect(mockedDevolverEmprestimo).toHaveBeenCalledTimes(2));
    expect(mockedNotificationSuccess).not.toHaveBeenCalled();
  });

  it('C18: deve controlar permissões e executar Finalizar e Cancelar atendimento (sucesso e falha)', async () => {
    mockedObterDetalhes.mockResolvedValue({
      sucesso: true,
      dados: JSON.parse(JSON.stringify(detalhesExternoBase)),
    });

    // Perfil não admin desabilita Finalizar e Cancelar atendimento
    const { container: containerComum, unmount: unmountComum } = renderPage({
      perfilSelecionado: { perfil: TipoPerfil.BASICO, perfilNome: 'Básico' },
    });
    await waitFor(() => expect(mockedObterDetalhes).toHaveBeenCalled());

    expect(containerComum.querySelector(`#${CDEP_BUTTON_FINALIZAR}`)).toBeDisabled();
    expect(containerComum.querySelector(`#${CDEP_BUTTON_CANCELAR_ATENDIMENTO}`)).toBeDisabled();
    unmountComum();

    // Perfil ADMIN_GERAL habilita Finalizar e Cancelar atendimento
    const { container } = renderPage({
      perfilSelecionado: { perfil: TipoPerfil.ADMIN_GERAL, perfilNome: 'Admin Geral' },
    });
    await waitFor(() => expect(screen.getByText('Livro Disponível')).toBeInTheDocument());

    const btnFinalizar = container.querySelector(`#${CDEP_BUTTON_FINALIZAR}`) as HTMLButtonElement;
    const btnCancelarAtend = container.querySelector(
      `#${CDEP_BUTTON_CANCELAR_ATENDIMENTO}`,
    ) as HTMLButtonElement;
    expect(btnFinalizar).not.toBeDisabled();
    expect(btnCancelarAtend).not.toBeDisabled();

    mockedConfirmacao.mockImplementation(({ onOk }: { onOk: () => void }) => onOk());

    // Finalizar atendimento: falha e depois sucesso
    mockedFinalizarAtendimento.mockResolvedValueOnce({ sucesso: false });
    fireEvent.click(btnFinalizar);
    await waitFor(() => expect(mockedFinalizarAtendimento).toHaveBeenCalledWith(55));
    expect(mockNavigate).not.toHaveBeenCalled();

    mockedFinalizarAtendimento.mockResolvedValueOnce({ sucesso: true });
    fireEvent.click(btnFinalizar);
    await waitFor(() => {
      expect(mockedConfirmacao).toHaveBeenCalledWith(
        expect.objectContaining({ content: DESEJA_FINALIZAR_ATENDIMENTO }),
      );
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
      expect(mockedNotificationSuccess).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Atendimento finalizado com sucesso',
      });
    });

    mockNavigate.mockReset();
    mockedNotificationSuccess.mockReset();

    // Cancelar atendimento: falha e depois sucesso
    mockedCancelarAtendimento.mockResolvedValueOnce({ sucesso: false });
    fireEvent.click(btnCancelarAtend);
    await waitFor(() => expect(mockedCancelarAtendimento).toHaveBeenCalledWith(55));
    expect(mockNavigate).not.toHaveBeenCalled();

    mockedCancelarAtendimento.mockResolvedValueOnce({ sucesso: true });
    fireEvent.click(btnCancelarAtend);
    await waitFor(() => {
      expect(mockedConfirmacao).toHaveBeenCalledWith(
        expect.objectContaining({ content: DESEJA_CANCELAR_ATENDIMENTO }),
      );
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
      expect(mockedNotificationSuccess).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Atendimento cancelado com sucesso',
      });
    });
  });

  it('C19 e C20: botões Voltar e Cancelar devem respeitar form.isFieldsTouched() e executar confirmações', async () => {
    mockedObterDetalhes.mockResolvedValue({
      sucesso: true,
      dados: JSON.parse(JSON.stringify(detalhesExternoBase)),
    });

    const { container } = renderPage();
    await waitFor(() => expect(screen.getByText('Livro Disponível')).toBeInTheDocument());

    // Sem modificações: Voltar navega direto, force-click Cancelar não chama confirmacao
    fireEvent.click(screen.getByTestId('force-click-cancelar'));
    expect(mockedConfirmacao).not.toHaveBeenCalled();

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_VOLTAR}`) as HTMLButtonElement);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
    mockNavigate.mockReset();

    // Simula alteração de um campo no form (tornando form.isFieldsTouched() = true)
    const inputId = container.querySelector(
      `#${CDEP_INPUT_NUMERO_SOLICITACAO}`,
    ) as HTMLInputElement;
    fireEvent.change(inputId, { target: { value: '999' } });
    // Submete onFinish do form (cobertura de onFinish)
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    const btnCancelar = container.querySelector(`#${CDEP_BUTTON_CANCELAR}`) as HTMLButtonElement;
    await waitFor(() => {
      expect(btnCancelar).not.toBeDisabled();
    });

    // Voltar com alterações chama confirmacao e navega no onOk
    mockedConfirmacao.mockImplementation(({ onOk }: { onOk: () => void }) => onOk());
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_VOLTAR}`) as HTMLButtonElement);
    expect(mockedConfirmacao).toHaveBeenCalledWith(
      expect.objectContaining({ content: DESEJA_SAIR_MODO_EDICAO }),
    );
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);

    // Cancelar com alterações chama confirmacao e executa resetFields no onOk
    fireEvent.click(btnCancelar);
    expect(mockedConfirmacao).toHaveBeenCalledWith(
      expect.objectContaining({ content: DESEJA_CANCELAR_ALTERACOES }),
    );

    // Após resetFields no onOk de Cancelar, Voltar não pede confirmação de saída
    mockedConfirmacao.mockClear();
    mockNavigate.mockReset();
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_VOLTAR}`) as HTMLButtonElement);
    expect(mockedConfirmacao).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
  });
});
