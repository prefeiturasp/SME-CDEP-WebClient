import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form, FormInstance } from 'antd';
import React from 'react';
import { notification } from '~/components/lib/notification';
import { ConsultaAcervoContext } from '../provider';
import { FiltroConsultaAcervo } from './index';

let mockActiveForm: FormInstance | undefined;

jest.mock('antd/es/form/hooks/useFormInstance', () => ({
  __esModule: true,
  default: () => mockActiveForm,
}));

jest.mock('~/components/cdep/input/busca-acervo', () => {
  const MockInputBuscaAcervo = () => <div data-testid='input-busca-acervo' />;
  return MockInputBuscaAcervo;
});

jest.mock('~/components/cdep/input/tipo-acervo', () => {
  const MockSelectTipoAcervo = () => <div data-testid='select-tipo-acervo' />;
  return MockSelectTipoAcervo;
});

jest.mock('~/components/lib/limpar-busca-button', () => ({
  __esModule: true,
  default: ({ buttonProps }: { buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> }) => (
    <button type='button' {...buttonProps}>
      Limpar
    </button>
  ),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    error: jest.fn(),
  },
}));

const renderFiltro = (overrides?: {
  onClickBuscar?: jest.Mock;
  limparDados?: jest.Mock;
  initialValues?: { anoInicial?: string; anoFinal?: string };
}) => {
  const onClickBuscar = overrides?.onClickBuscar ?? jest.fn();
  const limparDados = overrides?.limparDados ?? jest.fn();

  const Wrapper: React.FC = () => {
    const [form] = Form.useForm();
    mockActiveForm = form;
    return (
      <ConsultaAcervoContext.Provider
        value={{
          dataSource: [],
          loading: false,
          listParams: {},
          carregarDados: jest.fn(),
          onClickBuscar,
          limparDados,
        }}
      >
        <Form form={form} initialValues={overrides?.initialValues}>
          <FiltroConsultaAcervo />
        </Form>
      </ConsultaAcervoContext.Provider>
    );
  };

  return {
    ...render(<Wrapper />),
    onClickBuscar,
    limparDados,
  };
};

describe('FiltroConsultaAcervo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('C07: renderiza título, campos de filtro e botões de ação', () => {
    renderFiltro();

    expect(screen.getByText('Faça sua busca')).toBeInTheDocument();
    expect(screen.getByTestId('input-busca-acervo')).toBeInTheDocument();
    expect(screen.getByTestId('select-tipo-acervo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ano inicial')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ano final')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Limpar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument();
  });

  it('C08: sanitiza caracteres não numéricos e exibe validação quando ano < 1900', async () => {
    renderFiltro();

    const anoInicialInput = screen.getByPlaceholderText('Ano inicial') as HTMLInputElement;
    fireEvent.change(anoInicialInput, { target: { value: '18ab90' } });

    expect(anoInicialInput.value).toBe('1890');

    await waitFor(() => {
      expect(screen.getByText('O ano inicial deve começar a partir de 1900')).toBeInTheDocument();
    });
  });

  it('C09: exibe notificação de erro e bloqueia busca quando anoInicial > anoFinal', () => {
    const { onClickBuscar } = renderFiltro({
      initialValues: { anoInicial: '2022', anoFinal: '2020' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(notification.error).toHaveBeenCalledWith({
      message: 'Erro',
      description: 'Ano inicial não pode ser maior que ano final',
    });
    expect(onClickBuscar).not.toHaveBeenCalled();
  });

  it('C10: dispara onClickBuscar quando intervalo é válido e limparDados ao clicar em Limpar', () => {
    const { onClickBuscar, limparDados } = renderFiltro({
      initialValues: { anoInicial: '2015', anoFinal: '2020' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(onClickBuscar).toHaveBeenCalledTimes(1);
    expect(notification.error).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Limpar' }));
    expect(limparDados).toHaveBeenCalledTimes(1);
  });
});
