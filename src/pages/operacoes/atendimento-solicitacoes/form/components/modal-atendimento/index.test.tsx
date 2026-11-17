import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { notification } from '~/components/lib/notification';
import { DESEJA_CANCELAR_ALTERACOES } from '~/core/constants/mensagens';
import { dayjs } from '~/core/date/dayjs';
import { AcervoSolicitacaoDetalheDTO } from '~/core/dto/acervo-solicitacao-detalhe-dto';
import { AcervoSolicitacaoItemDetalheResumidoDTO } from '~/core/dto/acervo-solicitacao-item-detalhe-resumido-dto';
import { SituacaoSolicitacaoEnum } from '~/core/enum/situacao-atendimento-enum';
import { SituacaoEmprestimoEnum } from '~/core/enum/situacao-emprestimo-enum';
import { SituacaoSolicitacaoItemEnum } from '~/core/enum/situacao-item-atendimento-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoAtendimentoEnum } from '~/core/enum/tipo-atendimento-enum';
import { prorrogarEmprestimo } from '~/core/services/acervo-emprestimo';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { confirmacao } from '~/core/services/alerta-service';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { ModalAtendimento } from './index';

jest.mock('antd/es/date-picker/locale/pt_BR', () =>
  jest.requireActual('antd/lib/date-picker/locale/pt_BR'),
);
let mockCatchValidationRejections = false;
jest.mock('antd/es/form/Form', () => {
  const actual = jest.requireActual('antd/lib/form/Form');
  return {
    __esModule: true,
    ...actual,
    useForm: () => {
      const [form] = actual.useForm();
      if (mockCatchValidationRejections) {
        const origValidate = form.validateFields.bind(form);
        form.validateFields = (...args: unknown[]) =>
          origValidate(...args).catch(() => new Promise(() => undefined));
      }
      return [form];
    },
  };
});
jest.mock('antd/es/select', () => jest.requireActual('antd/lib/select'));

jest.mock('~/components/cdep/input/tipo-atendimento', () => {
  const { Form, Select } = jest.requireActual('antd');
  return {
    SelectTipoAtendimento: ({
      selectProps,
      formItemProps,
    }: {
      selectProps?: Record<string, unknown>;
      formItemProps?: Record<string, unknown>;
    }) => (
      <Form.Item name='tipoAtendimento' rules={[{ required: true }]} {...formItemProps}>
        <Select
          data-testid='select-tipo-atendimento'
          options={[
            { label: 'Email', value: 1 },
            { label: 'Presencial', value: 2 },
          ]}
          {...selectProps}
        />
      </Form.Item>
    ),
  };
});

jest.mock('~/components/lib/modal', () => {
  const ActualModal = jest.requireActual('~/components/lib/modal').default;
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => (
      <>
        <ActualModal {...props} />
        {props.open ? (
          <div data-testid='modal-force-actions'>
            <button type='button' data-testid='force-modal-ok' onClick={props.onOk as () => void}>
              ForceOk
            </button>
            <button
              type='button'
              data-testid='force-modal-cancel'
              onClick={props.onCancel as () => void}
            >
              ForceCancel
            </button>
          </div>
        ) : null}
      </>
    ),
  };
});

jest.mock('~/core/services/acervo-solicitacao-service', () => ({
  __esModule: true,
  default: {
    confirmarAtendimento: jest.fn(),
  },
}));

jest.mock('~/core/services/acervo-emprestimo', () => ({
  __esModule: true,
  prorrogarEmprestimo: jest.fn(),
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

const mockedConfirmarAtendimento = acervoSolicitacaoService.confirmarAtendimento as jest.Mock;
const mockedProrrogarEmprestimo = prorrogarEmprestimo as jest.Mock;
const mockedConfirmacao = confirmacao as jest.Mock;
const mockedNotificationSuccess = notification.success as jest.Mock;

const baseItemBibliografico: AcervoSolicitacaoItemDetalheResumidoDTO = {
  id: 10,
  acervoId: 100,
  codigo: 'T-001',
  titulo: 'Livro Histórico',
  tipoAcervoId: TipoAcervo.Bibliografico,
  tipoAcervo: 'Bibliográfico',
  situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO,
  tipoAtendimento: TipoAtendimentoEnum.Presencial,
  dataVisita: '2020-05-10T10:00:00',
  dataVisitaFormatada: '10/05/2020 14:30',
  dataEmprestimo: '2020-05-10',
  dataDevolucao: '2020-05-17',
};

const baseAtendimento: AcervoSolicitacaoDetalheDTO = {
  id: 55,
  usuarioId: 1,
  situacao: 'Aguardando atendimento',
  situacaoId: SituacaoSolicitacaoEnum.AGUARDANDO_ATENDIMENTO,
  itens: [],
  podeCancelar: true,
  podeFinalizar: true,
  dadosSolicitante: {
    id: 1,
    nome: 'Solicitante',
    login: '12345678900',
    telefone: '11999998888',
    endereco: 'Rua A',
    email: 'a@b.com',
    tipo: 'Estudante',
    tipoId: 2,
  },
};

const renderModal = ({
  isModalOpen = true,
  initialValuesModal = baseItemBibliografico,
  initialValuesAtendimento = baseAtendimento,
  desabilitarCampos = false,
  carregarDados = jest.fn(),
  setIsModalOpen = jest.fn(),
}: {
  isModalOpen?: boolean;
  initialValuesModal?: AcervoSolicitacaoItemDetalheResumidoDTO;
  initialValuesAtendimento?: AcervoSolicitacaoDetalheDTO;
  desabilitarCampos?: boolean;
  carregarDados?: jest.Mock;
  setIsModalOpen?: jest.Mock;
} = {}) => {
  const utils = render(
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
      <ModalAtendimento
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        initialValuesModal={initialValuesModal}
        initialValuesAtendimento={initialValuesAtendimento}
        acervoSolicitacaoId={55}
        carregarDados={carregarDados}
      />
    </PermissaoContext.Provider>,
  );

  return { ...utils, carregarDados, setIsModalOpen };
};

describe('ModalAtendimento (src/pages/operacoes/atendimento-solicitacoes/form/components/modal-atendimento/index.tsx)', () => {
  beforeEach(() => {
    mockCatchValidationRejections = false;
    mockedConfirmarAtendimento.mockReset();
    mockedProrrogarEmprestimo.mockReset();
    mockedConfirmacao.mockReset();
    mockedNotificationSuccess.mockReset();
  });

  it('C01: deve preencher os campos iniciais quando modal abrir com initialValuesModal completo', async () => {
    renderModal();

    expect(screen.getByText('Editar solicitação')).toBeInTheDocument();
    expect(screen.getByText('Data da visita')).toBeInTheDocument();
    expect(screen.getByText('Hora da visita')).toBeInTheDocument();
    expect(screen.getByText('Data do empréstimo')).toBeInTheDocument();
    expect(screen.getByText('Data da devolução')).toBeInTheDocument();
  });

  it('C02: para item não-bibliográfico por Email deve ocultar campos de visita/empréstimo e exibi-los ao selecionar Presencial', async () => {
    const itemFoto: AcervoSolicitacaoItemDetalheResumidoDTO = {
      id: 11,
      acervoId: 101,
      codigo: 'F-001',
      titulo: 'Foto Antiga',
      tipoAcervoId: TipoAcervo.Fotografico,
      tipoAcervo: 'Fotográfico',
      situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO,
      tipoAtendimento: TipoAtendimentoEnum.Email,
    };

    renderModal({ initialValuesModal: itemFoto });

    expect(screen.queryByText('Data da visita')).not.toBeInTheDocument();
    expect(screen.queryByText('Data do empréstimo')).not.toBeInTheDocument();

    // Seleciona Presencial no SelectTipoAtendimento
    const combobox = screen.getByRole('combobox');
    fireEvent.mouseDown(combobox);
    const opcaoPresencial = await screen.findByText('Presencial');
    fireEvent.click(opcaoPresencial);

    await waitFor(() => {
      expect(screen.getByText('Data da visita')).toBeInTheDocument();
      expect(screen.getByText('Hora da visita')).toBeInTheDocument();
    });
    expect(screen.queryByText('Data do empréstimo')).not.toBeInTheDocument();
  });

  it('C03: deve limpar empréstimo/devolução ao alterar dataVisita e calcular +7 dias em dataDevolucao ao alterar dataEmprestimo', async () => {
    renderModal();

    const dateInputs = document.querySelectorAll('.ant-picker-input input');
    // Ordem: [0] dataVisita, [1] horaVisita, [2] dataEmprestimo, [3] dataDevolucao
    expect(dateInputs.length).toBe(4);

    // Altera dataEmprestimo para uma data entre minDate (10/05/2020) e hoje, e verifica cálculo de +7 dias
    fireEvent.mouseDown(dateInputs[2]);
    fireEvent.change(dateInputs[2], { target: { value: '15/05/2020' } });
    fireEvent.keyDown(dateInputs[2], { key: 'Enter', code: 'Enter', keyCode: 13 });
    fireEvent.blur(dateInputs[2]);

    await waitFor(() => {
      expect((dateInputs[3] as HTMLInputElement).value).toBe('22/05/2020');
    });

    // Altera dataDevolucao diretamente (onChange)
    fireEvent.mouseDown(dateInputs[3]);
    fireEvent.change(dateInputs[3], { target: { value: '25/05/2020' } });
    fireEvent.keyDown(dateInputs[3], { key: 'Enter', code: 'Enter', keyCode: 13 });
    fireEvent.blur(dateInputs[3]);

    // Altera dataVisita e confirma que limpa dataEmprestimo e dataDevolucao
    const hoje = dayjs().format('DD/MM/YYYY');
    fireEvent.mouseDown(dateInputs[0]);
    fireEvent.change(dateInputs[0], { target: { value: hoje } });
    fireEvent.keyDown(dateInputs[0], { key: 'Enter', code: 'Enter', keyCode: 13 });
    fireEvent.blur(dateInputs[0]);

    await waitFor(() => {
      expect((dateInputs[2] as HTMLInputElement).value).toBe('');
      expect((dateInputs[3] as HTMLInputElement).value).toBe('');
    });
  });

  it('C04 e C09: deve validar obrigatoriedade de horaVisita quando dataVisita estiver preenchida e lidar com initialValuesModal indefinido', async () => {
    mockCatchValidationRejections = true;

    const itemSemHora: AcervoSolicitacaoItemDetalheResumidoDTO = {
      id: 12,
      acervoId: 102,
      codigo: 'D-001',
      titulo: 'Documento',
      tipoAcervoId: TipoAcervo.DocumentacaoTextual,
      situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO,
      tipoAtendimento: TipoAtendimentoEnum.Presencial,
    };

    const { unmount } = renderModal({ initialValuesModal: itemSemHora });

    const dataVisitaInput = document.querySelectorAll('.ant-picker-input input')[0];
    const hoje = dayjs().format('DD/MM/YYYY');
    fireEvent.mouseDown(dataVisitaInput);
    fireEvent.change(dataVisitaInput, { target: { value: hoje } });
    fireEvent.keyDown(dataVisitaInput, { key: 'Enter', code: 'Enter', keyCode: 13 });
    fireEvent.blur(dataVisitaInput);

    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await waitFor(() => {
      expect(screen.getByText('É necessário informar a hora da visita.')).toBeInTheDocument();
    });
    expect(mockedConfirmarAtendimento).not.toHaveBeenCalled();

    unmount();

    // Testa guarda defensiva if (initialValuesModal) em onFinish
    mockCatchValidationRejections = false;
    render(
      <PermissaoContext.Provider
        value={{
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
        }}
      >
        <ModalAtendimento
          isModalOpen={true}
          setIsModalOpen={jest.fn()}
          initialValuesModal={undefined}
          acervoSolicitacaoId={55}
          carregarDados={jest.fn()}
        />
      </PermissaoContext.Provider>,
    );

    fireEvent.mouseDown(screen.getByRole('combobox'));
    const opcaoEmail = await waitFor(() => {
      const opt = document.querySelector('.ant-select-item-option[title="Email"]');
      expect(opt).toBeInTheDocument();
      return opt as HTMLElement;
    });
    fireEvent.click(opcaoEmail);

    fireEvent.click(screen.getByTestId('force-modal-ok'));
    await waitFor(() => {
      expect(mockedConfirmarAtendimento).not.toHaveBeenCalled();
    });
  }, 15000);

  it('C05: deve aplicar corretamente regras de desabilitação para atendimentoFinalizado, situacaoEmprestimo DEVOLVIDO, item CANCELADO e dataVisita futura', () => {
    const { unmount: unmountFinalizado } = renderModal({
      initialValuesAtendimento: {
        ...baseAtendimento,
        situacaoId: SituacaoSolicitacaoEnum.FINALIZADO_ATENDIMENTO,
      },
    });
    const inputsFinalizado = document.querySelectorAll('.ant-picker-input input');
    expect(inputsFinalizado[0]).toBeDisabled(); // dataVisita desabilitada
    expect(inputsFinalizado[3]).not.toBeDisabled(); // dataDevolucao liberada quando atendimentoFinalizado
    unmountFinalizado();

    const { unmount: unmountDevolvido } = renderModal({
      initialValuesModal: {
        ...baseItemBibliografico,
        situacaoEmprestimo: SituacaoEmprestimoEnum.DEVOLVIDO,
      },
    });
    const inputsDevolvido = document.querySelectorAll('.ant-picker-input input');
    expect(inputsDevolvido[3]).toBeDisabled();
    unmountDevolvido();

    const { unmount: unmountCancelado } = renderModal({
      initialValuesModal: {
        ...baseItemBibliografico,
        situacaoId: SituacaoSolicitacaoItemEnum.CANCELADO,
        situacaoEmprestimo: SituacaoEmprestimoEnum.EMPRESTADO,
      },
    });
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeDisabled();
    unmountCancelado();

    renderModal({
      initialValuesModal: {
        ...baseItemBibliografico,
        dataVisita: dayjs().add(10, 'day').format('YYYY-MM-DDTHH:mm:ss'),
      },
    });
    const inputsFuturo = document.querySelectorAll('.ant-picker-input input');
    expect(inputsFuturo[2]).toBeDisabled();
    expect(inputsFuturo[3]).toBeDisabled();
  });

  it('C06: deve confirmar atendimento para Email (dataVisita undefined) e Presencial (com e sem horaVisita), tratando sucesso e falha e guarda isFieldsTouched', async () => {
    const carregarDados = jest.fn();
    const setIsModalOpen = jest.fn();

    // 1. Sem tocar em nenhum campo: onClickConfirmarParcial não chama confirmarAtendimento
    const { unmount } = renderModal({ carregarDados, setIsModalOpen });
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));
    await waitFor(() => {
      expect(mockedConfirmarAtendimento).not.toHaveBeenCalled();
    });
    unmount();

    // 2. Fluxo Email: muda de Presencial para Email e confirma com sucesso = true
    const itemFoto: AcervoSolicitacaoItemDetalheResumidoDTO = {
      id: 21,
      acervoId: 201,
      codigo: 'F-002',
      titulo: 'Foto 2',
      tipoAcervoId: TipoAcervo.Fotografico,
      situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO,
      tipoAtendimento: TipoAtendimentoEnum.Presencial,
      dataVisita: '2020-05-10T10:00:00',
      dataVisitaFormatada: '10/05/2020 15:00',
    };

    const { unmount: unmountEmail } = renderModal({
      initialValuesModal: itemFoto,
      carregarDados,
      setIsModalOpen,
    });

    fireEvent.mouseDown(screen.getByRole('combobox'));
    const opcaoEmail = await waitFor(() => {
      const opt = document.querySelector('.ant-select-item-option[title="Email"]');
      expect(opt).toBeInTheDocument();
      return opt as HTMLElement;
    });
    fireEvent.click(opcaoEmail);

    mockedConfirmarAtendimento.mockResolvedValueOnce({ sucesso: true });
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await waitFor(() => {
      expect(mockedConfirmarAtendimento).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 55,
          itemId: 21,
          dataVisita: undefined,
          tipoAtendimento: TipoAtendimentoEnum.Email,
        }),
      );
      expect(mockedNotificationSuccess).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'O item foi confirmado com sucesso',
      });
      expect(carregarDados).toHaveBeenCalled();
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });
    unmountEmail();

    // 3. Fluxo Presencial alterado e resposta sucesso = false
    carregarDados.mockReset();
    setIsModalOpen.mockReset();
    mockedNotificationSuccess.mockReset();

    renderModal({ carregarDados, setIsModalOpen });

    const dataEmprestimoInput = document.querySelectorAll('.ant-picker-input input')[2];
    fireEvent.mouseDown(dataEmprestimoInput);
    fireEvent.change(dataEmprestimoInput, { target: { value: '15/05/2020' } });
    fireEvent.keyDown(dataEmprestimoInput, { key: 'Enter', code: 'Enter', keyCode: 13 });
    fireEvent.blur(dataEmprestimoInput);

    mockedConfirmarAtendimento.mockResolvedValueOnce({ sucesso: false });
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await waitFor(() => {
      expect(mockedConfirmarAtendimento).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 55,
          itemId: 10,
          tipoAtendimento: TipoAtendimentoEnum.Presencial,
        }),
      );
    });
    expect(mockedNotificationSuccess).not.toHaveBeenCalled();
    expect(carregarDados).not.toHaveBeenCalled();
    expect(setIsModalOpen).not.toHaveBeenCalled();
  }, 15000);

  it('C07: para item Bibliografico FINALIZADO_MANUALMENTE deve chamar prorrogarEmprestimo (sucesso e falha)', async () => {
    const carregarDados = jest.fn();
    const setIsModalOpen = jest.fn();

    renderModal({
      initialValuesModal: {
        ...baseItemBibliografico,
        situacaoId: SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE,
      },
      carregarDados,
      setIsModalOpen,
    });

    mockedProrrogarEmprestimo.mockResolvedValueOnce({ sucesso: true });
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await waitFor(() => {
      expect(mockedProrrogarEmprestimo).toHaveBeenCalledWith(
        expect.objectContaining({
          acervoSolicitacaoItemId: 10,
        }),
      );
      expect(mockedNotificationSuccess).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Item prorrogado com sucesso',
      });
      expect(carregarDados).toHaveBeenCalledTimes(1);
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    // Cenário de falha em prorrogarEmprestimo
    carregarDados.mockReset();
    setIsModalOpen.mockReset();
    mockedNotificationSuccess.mockReset();
    mockedProrrogarEmprestimo.mockResolvedValueOnce({ sucesso: false });

    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await waitFor(() => {
      expect(mockedProrrogarEmprestimo).toHaveBeenCalledTimes(2);
    });
    expect(mockedNotificationSuccess).not.toHaveBeenCalled();
    expect(carregarDados).not.toHaveBeenCalled();
    expect(setIsModalOpen).not.toHaveBeenCalled();
  }, 15000);

  it('C08: ao cancelar modal sem alterações fecha direto; com alterações exibe confirmacao e fecha no onOk', async () => {
    const setIsModalOpen = jest.fn();
    const { unmount } = renderModal({ setIsModalOpen });

    // Sem alterações
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(mockedConfirmacao).not.toHaveBeenCalled();
    expect(setIsModalOpen).toHaveBeenCalledWith(false);

    unmount();
    setIsModalOpen.mockReset();

    renderModal({ setIsModalOpen });
    const dataEmprestimoInput = document.querySelectorAll('.ant-picker-input input')[2];
    fireEvent.mouseDown(dataEmprestimoInput);
    fireEvent.change(dataEmprestimoInput, { target: { value: '15/05/2020' } });
    fireEvent.keyDown(dataEmprestimoInput, { key: 'Enter', code: 'Enter', keyCode: 13 });
    fireEvent.blur(dataEmprestimoInput);

    mockedConfirmacao.mockImplementationOnce(({ onOk }: { onOk: () => void }) => onOk());

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    await waitFor(() => {
      expect(mockedConfirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_CANCELAR_ALTERACOES,
        }),
      );
    });
    expect(setIsModalOpen).toHaveBeenCalledWith(false);
  });
});
