import { FormInstance } from 'antd/es/form/Form';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { notification } from '~/components/lib/notification';
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
import { AcervoSolicitacaoDetalheDTO } from '~/core/dto/acervo-solicitacao-detalhe-dto';
import { AcervoSolicitacaoItemDetalheResumidoDTO } from '~/core/dto/acervo-solicitacao-item-detalhe-resumido-dto';
import { ROUTES } from '~/core/enum/routes';
import { SituacaoSolicitacaoItemEnum } from '~/core/enum/situacao-item-atendimento-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoAtendimentoEnum } from '~/core/enum/tipo-atendimento-enum';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { confirmacao } from '~/core/services/alerta-service';
import usuarioService from '~/core/services/usuario-service';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { SolicitacaoManual } from './index';

const mockNavigate = jest.fn();
const mockUseParams = jest.fn(() => ({} as { id?: string }));

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
jest.mock('antd/es/form/hooks/useFormInstance', () =>
  jest.requireActual('antd/lib/form/hooks/useFormInstance'),
);
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

jest.mock('~/components/lib/button/primary', () => {
  const ActualButtonPrimary = jest.requireActual('~/components/lib/button/primary').default;
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => (
      <>
        <ActualButtonPrimary {...props} />
        {props.id === 'CDEP_BUTTON_CONFIRMAR' ? (
          <button
            type='button'
            data-testid='force-click-confirmar'
            style={{ display: 'none' }}
            onClick={props.onClick as () => void}
          />
        ) : null}
      </>
    ),
  };
});

const mockStubItemBibliografico: AcervoSolicitacaoItemDetalheResumidoDTO = {
  id: 0,
  acervoId: 701,
  codigo: 'BIB-701',
  titulo: 'Livro Manual Teste',
  tipoAcervoId: TipoAcervo.Bibliografico,
  tipoAtendimento: TipoAtendimentoEnum.Presencial,
  dataVisita: '2026-11-10T10:00:00',
  dataEmprestimo: '2026-11-10',
  dataDevolucao: '2026-11-17',
  situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_VISITA,
};

jest.mock('./components/modal-adicionar-acervo', () => ({
  ModalAdicionarAcervo: ({
    isModalOpen,
    setIsModalOpen,
    formSolicitacaoManual,
    initialValuesModal,
  }: {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    formSolicitacaoManual: FormInstance;
    initialValuesModal?: AcervoSolicitacaoItemDetalheResumidoDTO;
  }) =>
    isModalOpen ? (
      <div data-testid='mock-modal-adicionar-acervo'>
        <span>{initialValuesModal ? `Editando ${initialValuesModal.codigo}` : 'Novo Acervo'}</span>
        <button
          type='button'
          data-testid='stub-add-bibliografico'
          onClick={() => {
            const atuais = formSolicitacaoManual.getFieldValue('itens') || [];
            formSolicitacaoManual.setFieldValue('itens', [...atuais, mockStubItemBibliografico]);
            setIsModalOpen(false);
          }}
        >
          Stub Adicionar Bibliografico
        </button>
        <button
          type='button'
          data-testid='stub-edit-item'
          onClick={() => {
            const atuais: AcervoSolicitacaoItemDetalheResumidoDTO[] =
              formSolicitacaoManual.getFieldValue('itens') || [];
            const atualizados = atuais.map((it) =>
              it.id === initialValuesModal?.id ? { ...it, titulo: `${it.titulo} (Editado)` } : it,
            );
            formSolicitacaoManual.setFieldValue('itens', atualizados);
            setIsModalOpen(false);
          }}
        >
          Stub Salvar Edição
        </button>
      </div>
    ) : null,
}));

jest.mock('~/core/services/acervo-solicitacao-service', () => ({
  __esModule: true,
  default: {
    obterDetalhesParaAtendimentoSolicitacoesPorId: jest.fn(),
    cancelarItemAtendimento: jest.fn(),
    confirmarAtendimentoManual: jest.fn(),
    alterarAtendimentoManual: jest.fn(),
    finalizarAtendimento: jest.fn(),
  },
}));

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    obterRfCpf: jest.fn(),
  },
}));

jest.mock('~/core/services/alerta-service', () => ({
  __esModule: true,
  confirmacao: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockedObterDetalhes =
  acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId as jest.Mock;
const mockedCancelarItem = acervoSolicitacaoService.cancelarItemAtendimento as jest.Mock;
const mockedConfirmarManual = acervoSolicitacaoService.confirmarAtendimentoManual as jest.Mock;
const mockedAlterarManual = acervoSolicitacaoService.alterarAtendimentoManual as jest.Mock;
const mockedFinalizarAtendimento = acervoSolicitacaoService.finalizarAtendimento as jest.Mock;
const mockedObterRfCpf = usuarioService.obterRfCpf as jest.Mock;
const mockedConfirmacao = confirmacao as jest.Mock;
const mockedNotificationSuccess = notification.success as jest.Mock;

const detalhesSalvaBase: AcervoSolicitacaoDetalheDTO = {
  id: 77,
  usuarioId: 10,
  dataSolicitacao: '2026-11-01T10:00:00',
  situacao: 'Aguardando visita',
  situacaoId: 3,
  podeCancelar: true,
  podeFinalizar: true,
  dadosSolicitante: {
    id: 10,
    nome: 'Pesquisador Manual',
    login: '12345678900',
    telefone: '11988887777',
    endereco: 'Rua Boa Vista, 100',
    email: 'manual@teste.com',
    tipo: 'Estudante',
    tipoId: TipoUsuario.ESTUDANTE,
  },
  itens: [
    {
      id: 1,
      acervoId: 801,
      codigo: 'BIB-801',
      titulo: 'Livro Salvo 1',
      tipoAcervoId: TipoAcervo.Bibliografico,
      tipoAtendimento: TipoAtendimentoEnum.Presencial,
      dataVisita: '2026-11-10T10:00:00',
      dataVisitaFormatada: '10/11/2026 10:00',
      dataEmprestimo: '2026-11-10',
      dataDevolucao: '2026-11-17',
      situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_VISITA,
    },
    {
      id: 2,
      acervoId: 802,
      codigo: 'FOT-802',
      titulo: 'Foto Cancelada',
      tipoAcervoId: TipoAcervo.Fotografico,
      tipoAtendimento: TipoAtendimentoEnum.Email,
      situacaoId: SituacaoSolicitacaoItemEnum.CANCELADO,
    },
  ],
};

const renderPage = ({ desabilitarCampos = false }: { desabilitarCampos?: boolean } = {}) =>
  render(
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
        <SolicitacaoManual />
      </PermissaoContext.Provider>
    </MemoryRouter>,
  );

describe('SolicitacaoManual (src/pages/operacoes/atendimento-solicitacoes/solicitacao-manual/index.tsx)', () => {
  jest.setTimeout(45000);

  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseParams.mockReturnValue({});
    mockedObterDetalhes.mockReset();
    mockedObterDetalhes.mockResolvedValue({ sucesso: false });
    mockedCancelarItem.mockReset();
    mockedCancelarItem.mockResolvedValue({ sucesso: false });
    mockedConfirmarManual.mockReset();
    mockedConfirmarManual.mockResolvedValue({ sucesso: false });
    mockedAlterarManual.mockReset();
    mockedAlterarManual.mockResolvedValue({ sucesso: false });
    mockedFinalizarAtendimento.mockReset();
    mockedFinalizarAtendimento.mockResolvedValue({ sucesso: false });
    mockedObterRfCpf.mockReset();
    mockedObterRfCpf.mockResolvedValue({ sucesso: false });
    mockedConfirmacao.mockReset();
    mockedNotificationSuccess.mockReset();
  });

  it('C11, C12 e C13: em nova solicitação manual, deve buscar solicitante, adicionar/remover item, confirmar e navegar para novo ID', async () => {
    mockedObterRfCpf.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        id: 10,
        nome: 'Cidadão Externo',
        login: '12345678900',
        telefone: '(11) 91234-5678',
        endereco: 'Av. São João, 50',
        email: 'cidadao@teste.com',
        tipoId: TipoUsuario.ESTUDANTE,
      },
    });

    const { container } = renderPage();

    // Testa guarda defensiva onClickConfirmarAtendimento e onClickCancelar sem alterações
    fireEvent.click(screen.getByTestId('force-click-confirmar'));
    fireEvent.click(screen.getByTestId('force-click-cancelar'));
    expect(mockedConfirmarManual).not.toHaveBeenCalled();
    expect(mockedConfirmacao).not.toHaveBeenCalled();

    const btnAdicionar = container.querySelector(
      `#${CDEP_BUTTON_ADICIONAR_ACERVOS}`,
    ) as HTMLButtonElement;
    expect(btnAdicionar).toBeDisabled();

    // Busca solicitante externo via InputRfCpf
    fireEvent.change(screen.getByPlaceholderText('Informe o RF ou CPF'), {
      target: { value: '12345678900' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nome do solicitante')).toHaveValue('Cidadão Externo');
      expect(screen.getByPlaceholderText('Telefone')).toHaveValue('(11) 91234-5678');
      expect(btnAdicionar).not.toBeDisabled();
    });

    // Abre modal stub e adiciona item bibliográfico
    fireEvent.click(btnAdicionar);
    expect(screen.getByTestId('mock-modal-adicionar-acervo')).toHaveTextContent('Novo Acervo');
    fireEvent.click(screen.getByTestId('stub-add-bibliografico'));

    await waitFor(() => {
      expect(screen.getByText('Livro Manual Teste')).toBeInTheDocument();
    });

    // Remove o item via "Remover item" e confirma via confirmacao(DESEJA_REMOVER_ACERVO)
    mockedConfirmacao.mockImplementationOnce(({ onOk }: { onOk: () => void }) => onOk());
    const btnRemover0 = container.querySelector(
      `#${CDEP_BUTTON_REMOVER_ACERVO}_0`,
    ) as HTMLButtonElement;
    fireEvent.click(btnRemover0);
    expect(mockedConfirmacao).toHaveBeenCalledWith(
      expect.objectContaining({ content: DESEJA_REMOVER_ACERVO }),
    );
    await waitFor(() => {
      expect(screen.queryByText('Livro Manual Teste')).not.toBeInTheDocument();
    });

    // Adiciona novamente para confirmar a solicitação manual
    fireEvent.click(btnAdicionar);
    fireEvent.click(screen.getByTestId('stub-add-bibliografico'));
    await waitFor(() => {
      expect(screen.getByText('Livro Manual Teste')).toBeInTheDocument();
    });

    // Confirma solicitação manual: testa sucesso = false e depois sucesso = true
    const btnConfirmar = container.querySelector(`#${CDEP_BUTTON_CONFIRMAR}`) as HTMLButtonElement;
    expect(btnConfirmar).not.toBeDisabled();

    mockedConfirmarManual.mockResolvedValueOnce({ sucesso: false });
    fireEvent.click(btnConfirmar);
    await waitFor(() => expect(mockedConfirmarManual).toHaveBeenCalledTimes(1));
    expect(mockNavigate).not.toHaveBeenCalled();

    mockedConfirmarManual.mockResolvedValueOnce({ sucesso: true, dados: 99 });
    fireEvent.click(btnConfirmar);

    await waitFor(() => {
      expect(mockedNotificationSuccess).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Atendimento confirmado com sucesso',
      });
      expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.ATENDIMENTO_SOLICITACAO_MANUAL}/99`);
    });
  });

  it('C14: em solicitação já cancelada redireciona para listagem; em solicitação interna CORESSO oculta Telefone/Endereço', async () => {
    mockUseParams.mockReturnValue({ id: '77' });

    mockedObterDetalhes.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        ...detalhesSalvaBase,
        situacaoId: SituacaoSolicitacaoItemEnum.CANCELADO,
      },
    });

    const { unmount } = renderPage();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
      expect(mockedNotificationSuccess).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Atendimento cancelado com sucesso',
      });
    });
    unmount();

    mockNavigate.mockReset();
    mockedObterDetalhes.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        ...detalhesSalvaBase,
        dataSolicitacao: '',
        dadosSolicitante: {
          ...detalhesSalvaBase.dadosSolicitante,
          telefone: '',
          tipoId: TipoUsuario.CORESSO,
        },
      },
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nome do solicitante')).toHaveValue('Pesquisador Manual');
    });
    expect(screen.queryByPlaceholderText('Telefone')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Endereço')).not.toBeInTheDocument();
  });

  it('C15 e C16: em solicitação salva deve cancelar item, editar/alterar atendimento manual e finalizar atendimento', async () => {
    mockUseParams.mockReturnValue({ id: '77' });
    mockedObterDetalhes.mockResolvedValue({
      sucesso: true,
      dados: JSON.parse(JSON.stringify(detalhesSalvaBase)),
    });

    const { container } = renderPage();

    await waitFor(
      () => {
        expect(screen.getByText('Livro Salvo 1')).toBeInTheDocument();
      },
      { timeout: 10000 },
    );

    // Item 1 já CANCELADO fica com Editar e Cancelar item desabilitados
    expect(container.querySelector(`#${CDEP_BUTTON_EDITAR}_1`)).toBeDisabled();
    expect(container.querySelector(`#${CDEP_BUTTON_REMOVER_ACERVO}_1`)).toBeDisabled();

    // Cancelar item 0 (sucesso = false e sucesso = true)
    mockedConfirmacao.mockImplementation(({ onOk }: { onOk: () => void }) => onOk());
    mockedCancelarItem.mockResolvedValueOnce({ sucesso: false });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_REMOVER_ACERVO}_0`) as HTMLElement);
    await waitFor(() => expect(mockedCancelarItem).toHaveBeenCalledWith(1));
    expect(mockedNotificationSuccess).not.toHaveBeenCalled();

    mockedCancelarItem.mockResolvedValueOnce({ sucesso: true });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_REMOVER_ACERVO}_0`) as HTMLElement);
    await waitFor(() => {
      expect(mockedConfirmacao).toHaveBeenCalledWith(
        expect.objectContaining({ content: DESEJA_CANCELAR_ITEM }),
      );
      expect(mockedNotificationSuccess).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Item cancelado com sucesso',
      });
    });

    // Edita item 0 via Modal stub e executa alterarAtendimentoManual (sucesso = true)
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_EDITAR}_0`) as HTMLElement);
    expect(screen.getByTestId('mock-modal-adicionar-acervo')).toHaveTextContent('Editando BIB-801');
    fireEvent.click(screen.getByTestId('stub-edit-item'));

    await waitFor(() => {
      expect(screen.getByText('Livro Salvo 1 (Editado)')).toBeInTheDocument();
    });

    mockedAlterarManual.mockResolvedValueOnce({ sucesso: true });
    const btnConfirmar = container.querySelector(`#${CDEP_BUTTON_CONFIRMAR}`) as HTMLButtonElement;
    fireEvent.click(btnConfirmar);

    await waitFor(() => {
      expect(mockedAlterarManual).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 77,
          usuarioId: 10,
        }),
      );
    });

    // Após recarregar dados, todos itens possuem id >= 1 e sem alterações -> Finalizar habilitado
    await waitFor(() => {
      expect(container.querySelector(`#${CDEP_BUTTON_FINALIZAR}`)).not.toBeDisabled();
    });

    mockedFinalizarAtendimento.mockResolvedValueOnce({ sucesso: false });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_FINALIZAR}`) as HTMLButtonElement);
    await waitFor(() => expect(mockedFinalizarAtendimento).toHaveBeenCalledWith(77));
    expect(mockNavigate).not.toHaveBeenCalled();

    mockedFinalizarAtendimento.mockResolvedValueOnce({ sucesso: true });
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_FINALIZAR}`) as HTMLButtonElement);
    await waitFor(() => {
      expect(mockedConfirmacao).toHaveBeenCalledWith(
        expect.objectContaining({ content: DESEJA_FINALIZAR_ATENDIMENTO }),
      );
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
    });
  });

  it('C17 e C18: deve executar fluxos de Voltar (finalização com/sem dataVisita, modo edição e confirmação em salva) e botão Cancelar', async () => {
    // 1. Nova solicitação sem alterações: Voltar navega direto; com alterações pede DESEJA_SAIR_MODO_EDICAO
    const { container, unmount } = renderPage();
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_VOLTAR}`) as HTMLButtonElement);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);

    mockNavigate.mockReset();
    fireEvent.change(screen.getByPlaceholderText('Informe o RF ou CPF'), {
      target: { value: '123' },
    });

    mockedConfirmacao.mockImplementation(({ onOk }: { onOk: () => void }) => onOk());
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_VOLTAR}`) as HTMLButtonElement);
    expect(mockedConfirmacao).toHaveBeenCalledWith(
      expect.objectContaining({ content: DESEJA_SAIR_MODO_EDICAO }),
    );
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);

    // Botão Cancelar reseta campos quando modificado
    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CANCELAR}`) as HTMLButtonElement);
    expect(mockedConfirmacao).toHaveBeenCalledWith(
      expect.objectContaining({ content: DESEJA_CANCELAR_ALTERACOES }),
    );
    unmount();

    // 2. Solicitação salva: VoltarFinalizacao com item sem dataVisita navega direto
    mockNavigate.mockReset();
    mockedConfirmacao.mockClear();
    mockUseParams.mockReturnValue({ id: '77' });
    mockedObterDetalhes.mockResolvedValueOnce({
      sucesso: true,
      dados: JSON.parse(JSON.stringify(detalhesSalvaBase)), // item 2 sem dataVisita
    });

    const { container: containerSalva1, unmount: unmountSalva1 } = renderPage();
    await waitFor(() => expect(screen.getByText('Livro Salvo 1')).toBeInTheDocument());

    fireEvent.click(containerSalva1.querySelector(`#${CDEP_BUTTON_VOLTAR}`) as HTMLButtonElement);
    expect(mockedConfirmacao).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACOES);
    unmountSalva1();

    // 3. Solicitação salva com todos itens tendo dataVisita -> VoltarFinalizacao pede DESEJA_SAIR_MODO_EDICAO_FINALIZANDO_ATENDIMENTO
    mockNavigate.mockReset();
    mockedObterDetalhes.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        ...detalhesSalvaBase,
        itens: [detalhesSalvaBase.itens[0]],
      },
    });

    const { container: containerSalva2 } = renderPage();
    await waitFor(() => expect(screen.getByText('Livro Salvo 1')).toBeInTheDocument());

    fireEvent.click(containerSalva2.querySelector(`#${CDEP_BUTTON_VOLTAR}`) as HTMLButtonElement);
    expect(mockedConfirmacao).toHaveBeenCalledWith(
      expect.objectContaining({ content: DESEJA_SAIR_MODO_EDICAO_FINALIZANDO_ATENDIMENTO }),
    );

    // Se editar um item em solicitação salva e clicar em Voltar -> pede DESEJA_SAIR_MODO_EDICAO_CONFIRMANDO_ITENS_SOLICITACAO_ALTERADOS
    fireEvent.click(containerSalva2.querySelector(`#${CDEP_BUTTON_EDITAR}_0`) as HTMLElement);
    fireEvent.click(screen.getByTestId('stub-edit-item'));

    mockedAlterarManual.mockResolvedValueOnce({ sucesso: true });
    mockedConfirmacao.mockClear();
    fireEvent.click(containerSalva2.querySelector(`#${CDEP_BUTTON_VOLTAR}`) as HTMLButtonElement);
    expect(mockedConfirmacao).toHaveBeenCalledWith(
      expect.objectContaining({
        content: DESEJA_SAIR_MODO_EDICAO_CONFIRMANDO_ITENS_SOLICITACAO_ALTERADOS,
      }),
    );
  });
});
