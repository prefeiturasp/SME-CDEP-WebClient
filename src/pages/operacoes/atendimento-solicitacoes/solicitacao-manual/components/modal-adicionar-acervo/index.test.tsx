import { Form } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { notification } from '~/components/lib/notification';
import { DESEJA_CANCELAR_ALTERACOES } from '~/core/constants/mensagens';
import { dayjs } from '~/core/date/dayjs';
import { AcervoSolicitacaoItemDetalheResumidoDTO } from '~/core/dto/acervo-solicitacao-item-detalhe-resumido-dto';
import { SituacaoSolicitacaoItemEnum } from '~/core/enum/situacao-item-atendimento-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoAtendimentoEnum } from '~/core/enum/tipo-atendimento-enum';
import { obterCodigoTombo } from '~/core/services/acervo-service';
import { confirmacao } from '~/core/services/alerta-service';
import { ModalAdicionarAcervo } from './index';

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

jest.mock('antd/es/form/hooks/useFormInstance', () =>
  jest.requireActual('antd/lib/form/hooks/useFormInstance'),
);
jest.mock('antd/es/select', () => jest.requireActual('antd/lib/select'));
jest.mock('antd/es/date-picker/locale/pt_BR', () =>
  jest.requireActual('antd/lib/date-picker/locale/pt_BR'),
);

jest.mock('~/components/cdep/input/tipo-atendimento', () => {
  const { Form: AntForm, Select } = jest.requireActual('antd');
  return {
    SelectTipoAtendimento: ({
      selectProps,
      formItemProps,
    }: {
      selectProps?: Record<string, unknown>;
      formItemProps?: Record<string, unknown>;
    }) => (
      <AntForm.Item name='tipoAtendimento' rules={[{ required: true }]} {...formItemProps}>
        <Select
          data-testid='select-tipo-atendimento'
          options={[
            { label: 'Email', value: 1 },
            { label: 'Presencial', value: 2 },
          ]}
          {...selectProps}
        />
      </AntForm.Item>
    ),
  };
});

jest.mock('~/core/services/acervo-service', () => ({
  __esModule: true,
  obterCodigoTombo: jest.fn(),
}));

jest.mock('~/core/services/alerta-service', () => ({
  __esModule: true,
  confirmacao: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    error: jest.fn(),
  },
}));

const mockedObterCodigoTombo = obterCodigoTombo as jest.Mock;
const mockedConfirmacao = confirmacao as jest.Mock;
const mockedNotificationError = notification.error as jest.Mock;

const ModalWrapper = ({
  isModalOpen = true,
  setIsModalOpen = jest.fn(),
  initialValuesModal,
  initialItens = [],
  onInspectParentItens,
}: {
  isModalOpen?: boolean;
  setIsModalOpen?: jest.Mock;
  initialValuesModal?: AcervoSolicitacaoItemDetalheResumidoDTO;
  initialItens?: AcervoSolicitacaoItemDetalheResumidoDTO[];
  onInspectParentItens?: (itens: AcervoSolicitacaoItemDetalheResumidoDTO[]) => void;
}) => {
  const [parentForm] = Form.useForm();
  parentForm.setFieldValue('itens', initialItens);

  return (
    <>
      <ModalAdicionarAcervo
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        initialValuesModal={initialValuesModal}
        formSolicitacaoManual={parentForm as unknown as FormInstance}
      />
      {onInspectParentItens ? (
        <button
          type='button'
          data-testid='inspect-parent-itens'
          onClick={() => onInspectParentItens(parentForm.getFieldValue('itens') || [])}
        >
          Inspecionar
        </button>
      ) : null}
    </>
  );
};

describe('ModalAdicionarAcervo (src/pages/operacoes/atendimento-solicitacoes/solicitacao-manual/components/modal-adicionar-acervo/index.tsx)', () => {
  jest.setTimeout(45000);

  beforeEach(() => {
    mockCatchValidationRejections = false;
    mockedObterCodigoTombo.mockReset();
    mockedConfirmacao.mockReset();
    mockedNotificationError.mockReset();
  });

  it('C04: ao buscar código bibliográfico disponível deve preencher campos e habilitar Adicionar; indisponível deve desabilitar Adicionar', async () => {
    const setIsModalOpen = jest.fn();
    mockedObterCodigoTombo.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        id: 101,
        codigo: 'TOMBO-1',
        nome: 'Livro Disponível',
        tipo: TipoAcervo.Bibliografico,
        temControleDisponibilidade: true,
        estaDisponivel: true,
      },
    });

    render(<ModalWrapper setIsModalOpen={setIsModalOpen} />);

    const inputTombo = screen.getByPlaceholderText('N° do tombo/código');
    fireEvent.change(inputTombo, { target: { value: 'TOMBO-1' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Título do acervo')).toHaveValue('Livro Disponível');
      expect(screen.getByText('Data do empréstimo')).toBeInTheDocument();
      expect(screen.getByText('Data da devolução')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /adicionar/i })).not.toBeDisabled();

    // Busca código bibliográfico indisponível -> desabilita botão Adicionar
    mockedObterCodigoTombo.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        id: 102,
        codigo: 'TOMBO-2',
        nome: 'Livro Indisponível',
        tipo: TipoAcervo.Bibliografico,
        temControleDisponibilidade: true,
        estaDisponivel: false,
      },
    });

    fireEvent.change(inputTombo, { target: { value: 'TOMBO-2' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(
      () => {
        expect(screen.getByPlaceholderText('Título do acervo')).toHaveValue('Livro Indisponível');
        expect(screen.getByRole('button', { name: /adicionar/i })).toBeDisabled();
      },
      { timeout: 10000 },
    );
  });

  it('C05 e C10: deve adicionar item não-bibliográfico por Email (FINALIZADO_MANUALMENTE) e por Presencial em lista já populada', async () => {
    const setIsModalOpen = jest.fn();
    const inspectSpy = jest.fn();

    mockedObterCodigoTombo.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        id: 201,
        codigo: 'FOTO-01',
        nome: 'Fotografia Histórica',
        tipo: TipoAcervo.Fotografico,
      },
    });

    const { unmount } = render(
      <ModalWrapper setIsModalOpen={setIsModalOpen} onInspectParentItens={inspectSpy} />,
    );

    const inputTombo = screen.getByPlaceholderText('N° do tombo/código');
    fireEvent.change(inputTombo, { target: { value: 'FOTO-01' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Título do acervo')).toHaveValue('Fotografia Histórica');
    });

    fireEvent.mouseDown(screen.getByRole('combobox'));
    const opcaoEmail = await waitFor(() => {
      const opt = document.querySelector('.ant-select-item-option[title="Email"]');
      expect(opt).toBeInTheDocument();
      return opt as HTMLElement;
    });
    fireEvent.click(opcaoEmail);

    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }));

    await waitFor(() => {
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    fireEvent.click(screen.getByTestId('inspect-parent-itens'));
    expect(inspectSpy).toHaveBeenLastCalledWith([
      expect.objectContaining({
        id: 0,
        acervoId: 201,
        codigo: 'FOTO-01',
        titulo: 'Fotografia Histórica',
        tipoAtendimento: TipoAtendimentoEnum.Email,
        dataVisita: '',
        situacaoId: SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE,
      }),
    ]);

    unmount();

    // Adiciona item por Presencial com lista já contendo outro item (C10)
    setIsModalOpen.mockReset();
    inspectSpy.mockReset();
    mockedObterCodigoTombo.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        id: 202,
        codigo: 'DOC-02',
        nome: 'Documento Presencial',
        tipo: TipoAcervo.DocumentacaoTextual,
      },
    });

    render(
      <ModalWrapper
        setIsModalOpen={setIsModalOpen}
        onInspectParentItens={inspectSpy}
        initialItens={[
          {
            id: 1,
            acervoId: 999,
            codigo: 'PREV-1',
            titulo: 'Item Prévio',
            situacaoId: SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE,
          },
        ]}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('N° do tombo/código'), {
      target: { value: 'DOC-02' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Título do acervo')).toHaveValue('Documento Presencial');
    });

    fireEvent.mouseDown(screen.getByRole('combobox'));
    const opcaoPresencial = await waitFor(() => {
      const opt = document.querySelector('.ant-select-item-option[title="Presencial"]');
      expect(opt).toBeInTheDocument();
      return opt as HTMLElement;
    });
    fireEvent.click(opcaoPresencial);

    const dateInputs = document.querySelectorAll('.ant-picker-input input');
    const hoje = dayjs().format('DD/MM/YYYY');
    fireEvent.mouseDown(dateInputs[0]);
    fireEvent.change(dateInputs[0], { target: { value: hoje } });
    fireEvent.keyDown(dateInputs[0], { key: 'Enter', code: 'Enter', keyCode: 13 });
    fireEvent.blur(dateInputs[0]);

    fireEvent.mouseDown(dateInputs[1]);
    fireEvent.change(dateInputs[1], { target: { value: '14:30' } });
    fireEvent.keyDown(dateInputs[1], { key: 'Enter', code: 'Enter', keyCode: 13 });
    fireEvent.blur(dateInputs[1]);

    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }));

    await waitFor(() => {
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    fireEvent.click(screen.getByTestId('inspect-parent-itens'));
    expect(inspectSpy).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ acervoId: 999 }),
        expect.objectContaining({
          acervoId: 202,
          tipoAtendimento: TipoAtendimentoEnum.Presencial,
          situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_VISITA,
        }),
      ]),
    );
  });

  it('C06: deve bloquear adição de tombo/código duplicado ativo e permitir se item existente estiver CANCELADO', async () => {
    const setIsModalOpen = jest.fn();
    mockedObterCodigoTombo.mockResolvedValue({
      sucesso: true,
      dados: {
        id: 301,
        codigo: 'DUP-01',
        nome: 'Item Duplicado',
        tipo: TipoAcervo.Fotografico,
      },
    });

    const { unmount } = render(
      <ModalWrapper
        setIsModalOpen={setIsModalOpen}
        initialItens={[
          {
            id: 0,
            acervoId: 301,
            codigo: 'DUP-01',
            titulo: 'Item Duplicado',
            situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_VISITA,
          },
        ]}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('N° do tombo/código'), {
      target: { value: 'DUP-01' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Título do acervo')).toHaveValue('Item Duplicado');
    });

    fireEvent.mouseDown(screen.getByRole('combobox'));
    const optEmail = await waitFor(
      () => document.querySelector('.ant-select-item-option[title="Email"]') as HTMLElement,
    );
    fireEvent.click(optEmail);
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }));

    await waitFor(() => {
      expect(mockedNotificationError).toHaveBeenCalledWith({
        message: 'Erro',
        description: 'N° do tombo/código duplicado',
      });
    });
    expect(setIsModalOpen).not.toHaveBeenCalled();

    unmount();
    mockedNotificationError.mockReset();

    // Item duplicado CANCELADO deve permitir nova inclusão
    render(
      <ModalWrapper
        setIsModalOpen={setIsModalOpen}
        initialItens={[
          {
            id: 5,
            acervoId: 301,
            codigo: 'DUP-01',
            titulo: 'Item Duplicado',
            situacaoId: SituacaoSolicitacaoItemEnum.CANCELADO,
          },
        ]}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('N° do tombo/código'), {
      target: { value: 'DUP-01' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Título do acervo')).toHaveValue('Item Duplicado');
    });

    fireEvent.mouseDown(screen.getByRole('combobox'));
    const optEmail2 = await waitFor(
      () => document.querySelector('.ant-select-item-option[title="Email"]') as HTMLElement,
    );
    fireEvent.click(optEmail2);
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }));

    await waitFor(() => {
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });
    expect(mockedNotificationError).not.toHaveBeenCalled();
  });

  it('C07: em modo edição deve preencher campos via initialValuesModal e substituir item existente no parentForm', async () => {
    const setIsModalOpen = jest.fn();
    const inspectSpy = jest.fn();

    const itemEditado: AcervoSolicitacaoItemDetalheResumidoDTO = {
      id: 0,
      acervoId: 401,
      codigo: 'BIB-401',
      titulo: 'Livro em Edição',
      tipoAcervoId: TipoAcervo.Bibliografico,
      tipoAtendimento: TipoAtendimentoEnum.Presencial,
      dataVisita: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      dataVisitaFormatada: `${dayjs().format('DD/MM/YYYY')} 11:00`,
      dataEmprestimo: dayjs().format('YYYY-MM-DD'),
      dataDevolucao: dayjs().add(7, 'day').format('YYYY-MM-DD'),
      situacaoId: SituacaoSolicitacaoItemEnum.AGUARDANDO_VISITA,
    };

    render(
      <ModalWrapper
        setIsModalOpen={setIsModalOpen}
        initialValuesModal={itemEditado}
        initialItens={[itemEditado]}
        onInspectParentItens={inspectSpy}
      />,
    );

    expect(screen.getByPlaceholderText('Título do acervo')).toHaveValue('Livro em Edição');

    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }));

    await waitFor(() => {
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    fireEvent.click(screen.getByTestId('inspect-parent-itens'));
    expect(inspectSpy).toHaveBeenLastCalledWith([
      expect.objectContaining({
        acervoId: 401,
        codigo: 'BIB-401',
      }),
    ]);
  });

  it('C08 e C09: deve validar horaVisita quando dataVisita estiver preenchida e confirmar cancelamento quando alterado', async () => {
    mockCatchValidationRejections = true;
    const setIsModalOpen = jest.fn();

    const { unmount } = render(
      <ModalWrapper
        setIsModalOpen={setIsModalOpen}
        initialValuesModal={{
          id: 15,
          acervoId: 501,
          codigo: 'DOC-501',
          titulo: 'Documento Sem Hora',
          tipoAcervoId: TipoAcervo.DocumentacaoTextual,
          tipoAtendimento: TipoAtendimentoEnum.Presencial,
          dataVisita: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }));

    await waitFor(() => {
      expect(screen.getByText('É necessário informar a hora da visita.')).toBeInTheDocument();
    });
    expect(setIsModalOpen).not.toHaveBeenCalled();

    // Cancelar sem tocar fecha direto
    mockCatchValidationRejections = false;
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(mockedConfirmacao).not.toHaveBeenCalled();
    expect(setIsModalOpen).toHaveBeenCalledWith(false);
    unmount();

    // Nova instância tocada: cancelar dispara confirmacao e fecha no onOk
    setIsModalOpen.mockReset();
    mockedConfirmacao.mockImplementationOnce(({ onOk }: { onOk: () => void }) => onOk());

    render(<ModalWrapper setIsModalOpen={setIsModalOpen} />);
    fireEvent.change(screen.getByPlaceholderText('N° do tombo/código'), {
      target: { value: 'ALTERADO' },
    });
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(mockedConfirmacao).toHaveBeenCalledWith(
      expect.objectContaining({ content: DESEJA_CANCELAR_ALTERACOES }),
    );
    expect(setIsModalOpen).toHaveBeenCalledWith(false);
  });
});
