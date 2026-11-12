import { render, screen, fireEvent } from '~/tests/test-utils';
import { FiltroConsultaAcervo } from './index';
import { ConsultaAcervoContext } from '../provider';
import { notification } from '~/components/lib/notification';
import { CDEP_INPUT_ANO_FINAL, CDEP_INPUT_ANO_INICIAL } from '~/core/constants/ids/input';

const mockForm = {
  getFieldsValue: jest.fn(),
  resetFields: jest.fn(),
};

jest.mock('antd/es/form/hooks/useFormInstance', () => ({
  __esModule: true,
  default: () => mockForm,
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    error: jest.fn(),
  },
}));

jest.mock('~/components/cdep/input/busca-acervo', () => {
  const MockInputBuscaAcervo = () => (
    <div data-testid='mock-input-busca-acervo'>InputBuscaAcervo</div>
  );
  return MockInputBuscaAcervo;
});

jest.mock('~/components/cdep/input/tipo-acervo', () => {
  const MockSelectTipoAcervo = ({ formItemProps }: any) => (
    <div data-testid='mock-select-tipo-acervo'>
      {formItemProps?.label}
      SelectTipoAcervo
    </div>
  );
  return MockSelectTipoAcervo;
});

const capturedFormItemProps: Record<string, any> = {};
jest.mock('~/pages/cadastros/acervo/form/form-fields', () => ({
  InputAno: ({ formItemProps, inputItemProps }: any) => {
    capturedFormItemProps[inputItemProps?.id] = formItemProps;
    return (
      <div>
        {formItemProps?.label}
        <input
          data-testid={inputItemProps?.id}
          placeholder={inputItemProps?.placeholder}
          onChange={(e) => {
            if (formItemProps?.getValueFromEvent) {
              formItemProps.getValueFromEvent(e);
            }
          }}
        />
      </div>
    );
  },
}));

describe('FiltroConsultaAcervo', () => {
  const mockOnClickBuscar = jest.fn();
  const mockLimparDados = jest.fn();

  const renderComponent = () =>
    render(
      <ConsultaAcervoContext.Provider
        value={
          {
            onClickBuscar: mockOnClickBuscar,
            limparDados: mockLimparDados,
          } as any
        }
      >
        <FiltroConsultaAcervo />
      </ConsultaAcervoContext.Provider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockForm.getFieldsValue.mockReturnValue({
      anoInicial: undefined,
      anoFinal: undefined,
    });
  });

  describe('Renderização dos elementos', () => {
    test('renderiza os títulos, labels e botões do filtro', () => {
      renderComponent();

      expect(screen.getByText('Faça sua busca')).toBeInTheDocument();
      expect(screen.getByTestId('mock-input-busca-acervo')).toBeInTheDocument();
      expect(screen.getByText('Ano inicial')).toBeInTheDocument();
      expect(screen.getByText('Ano final')).toBeInTheDocument();
      expect(screen.getByText('Busca por tipos de acervos')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /limpar busca/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
    });

    test('configura regras de validação para ano inicial e final', () => {
      renderComponent();

      const ruleInicial = capturedFormItemProps[CDEP_INPUT_ANO_INICIAL]?.rules[0];
      expect(ruleInicial?.pattern).toEqual(/^(19\d{2}|20\d{2})$/);
      expect(ruleInicial?.pattern.test('1950')).toBe(true);
      expect(ruleInicial?.pattern.test('2024')).toBe(true);
      expect(ruleInicial?.pattern.test('1899')).toBe(false);

      const { container } = render(<>{ruleInicial?.message}</>);
      expect(container).toHaveTextContent('O ano inicial deve começar a partir de 1900');
    });
  });

  describe('Formatação de entrada dos anos (removerCaracteresEspeciaisAnoInicialFinal)', () => {
    test('remove caracteres não numéricos ao digitar no ano inicial e ano final', () => {
      renderComponent();

      const inputAnoInicial = screen.getByTestId(CDEP_INPUT_ANO_INICIAL);
      fireEvent.change(inputAnoInicial, { target: { value: 'abc2020!#' } });

      const getValueInicial = capturedFormItemProps[CDEP_INPUT_ANO_INICIAL]?.getValueFromEvent;
      expect(getValueInicial({ target: { value: 'abc2020!#' } })).toBe('2020');

      const getValueFinal = capturedFormItemProps[CDEP_INPUT_ANO_FINAL]?.getValueFromEvent;
      expect(getValueFinal({ target: { value: '2024xyz' } })).toBe('2024');
    });
  });

  describe('Botão Limpar Busca', () => {
    test('chama limparDados com a instância do formulário ao clicar em Limpar busca', () => {
      renderComponent();

      const btnLimpar = screen.getByRole('button', { name: /limpar busca/i });
      fireEvent.click(btnLimpar);

      expect(mockLimparDados).toHaveBeenCalledTimes(1);
      expect(mockLimparDados).toHaveBeenCalledWith(mockForm);
    });
  });

  describe('Botão Buscar e Validação de Anos', () => {
    test('dispara onClickBuscar com sucesso quando ano inicial for menor que ano final', () => {
      mockForm.getFieldsValue.mockReturnValue({
        anoInicial: '2000',
        anoFinal: '2010',
      });

      renderComponent();

      const btnBuscar = screen.getByRole('button', { name: /buscar/i });
      fireEvent.click(btnBuscar);

      expect(mockForm.getFieldsValue).toHaveBeenCalledWith(['anoInicial', 'anoFinal']);
      expect(notification.error).not.toHaveBeenCalled();
      expect(mockOnClickBuscar).toHaveBeenCalledTimes(1);
      expect(mockOnClickBuscar).toHaveBeenCalledWith(mockForm);
    });

    test('dispara onClickBuscar com sucesso quando ano inicial for igual ao ano final', () => {
      mockForm.getFieldsValue.mockReturnValue({
        anoInicial: '2020',
        anoFinal: '2020',
      });

      renderComponent();

      const btnBuscar = screen.getByRole('button', { name: /buscar/i });
      fireEvent.click(btnBuscar);

      expect(notification.error).not.toHaveBeenCalled();
      expect(mockOnClickBuscar).toHaveBeenCalledTimes(1);
      expect(mockOnClickBuscar).toHaveBeenCalledWith(mockForm);
    });

    test('exibe notificação de erro e não chama onClickBuscar quando ano inicial for maior que ano final', () => {
      mockForm.getFieldsValue.mockReturnValue({
        anoInicial: '2025',
        anoFinal: '2020',
      });

      renderComponent();

      const btnBuscar = screen.getByRole('button', { name: /buscar/i });
      fireEvent.click(btnBuscar);

      expect(notification.error).toHaveBeenCalledWith({
        message: 'Erro',
        description: 'Ano inicial não pode ser maior que ano final',
      });
      expect(mockOnClickBuscar).not.toHaveBeenCalled();
    });

    test('dispara onClickBuscar quando apenas ano inicial for informado', () => {
      mockForm.getFieldsValue.mockReturnValue({
        anoInicial: '2000',
        anoFinal: undefined,
      });

      renderComponent();

      const btnBuscar = screen.getByRole('button', { name: /buscar/i });
      fireEvent.click(btnBuscar);

      expect(notification.error).not.toHaveBeenCalled();
      expect(mockOnClickBuscar).toHaveBeenCalledTimes(1);
      expect(mockOnClickBuscar).toHaveBeenCalledWith(mockForm);
    });

    test('dispara onClickBuscar quando apenas ano final for informado', () => {
      mockForm.getFieldsValue.mockReturnValue({
        anoInicial: undefined,
        anoFinal: '2020',
      });

      renderComponent();

      const btnBuscar = screen.getByRole('button', { name: /buscar/i });
      fireEvent.click(btnBuscar);

      expect(notification.error).not.toHaveBeenCalled();
      expect(mockOnClickBuscar).toHaveBeenCalledTimes(1);
      expect(mockOnClickBuscar).toHaveBeenCalledWith(mockForm);
    });

    test('dispara onClickBuscar quando nenhum ano for informado', () => {
      mockForm.getFieldsValue.mockReturnValue({
        anoInicial: undefined,
        anoFinal: undefined,
      });

      renderComponent();

      const btnBuscar = screen.getByRole('button', { name: /buscar/i });
      fireEvent.click(btnBuscar);

      expect(notification.error).not.toHaveBeenCalled();
      expect(mockOnClickBuscar).toHaveBeenCalledTimes(1);
      expect(mockOnClickBuscar).toHaveBeenCalledWith(mockForm);
    });
  });
});
