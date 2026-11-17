import { act, render, screen, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import React, { useContext } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { ROUTES } from '~/core/enum/routes';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { pesquisarAcervosAreaPublica } from '~/core/services/acervo-service';
import ConsultaAcervoContextProvider, { ConsultaAcervoContext } from './index';

jest.mock('~/core/services/acervo-service', () => ({
  pesquisarAcervosAreaPublica: jest.fn(),
}));

const mockedPesquisarAcervos = pesquisarAcervosAreaPublica as jest.Mock;

const LocationDisplay: React.FC = () => {
  const location = useLocation();
  return <span data-testid='location-path'>{location.pathname}</span>;
};

const ConsumerHarness: React.FC = () => {
  const [form] = Form.useForm();
  const ctx = useContext(ConsultaAcervoContext);

  return (
    <Form
      form={form}
      initialValues={{ textoLivre: 'educacao', tipoAcervo: TipoAcervo.Bibliografico }}
    >
      <Form.Item name='textoLivre'>
        <input aria-label='textoLivre' />
      </Form.Item>
      <Form.Item name='tipoAcervo'>
        <input aria-label='tipoAcervo' />
      </Form.Item>
      <LocationDisplay />
      <span data-testid='loading'>{String(ctx.loading)}</span>
      <span data-testid='count'>{ctx.dataSource.length}</span>
      <span data-testid='texto'>{ctx.textoLivrePesquisado ?? ''}</span>
      <span data-testid='current'>{ctx.listParams.current}</span>
      <span data-testid='pageSize'>{ctx.listParams.pageSize}</span>
      <span data-testid='total'>{ctx.listParams.total ?? 'none'}</span>
      <span data-testid='hideSingle'>{String(ctx.listParams.hideOnSinglePage)}</span>

      <button type='button' onClick={() => ctx.onClickBuscar(form)}>
        Buscar
      </button>
      <button type='button' onClick={() => ctx.carregarDados({}, { textoLivre: '' })}>
        CarregarFallback
      </button>
      <button type='button' onClick={() => ctx.limparDados(form)}>
        Limpar
      </button>
    </Form>
  );
};

describe('ConsultaAcervoContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('C01: expõe valores padrão quando consumido fora do provider', () => {
    render(
      <MemoryRouter>
        <ConsumerHarness />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('current')).toHaveTextContent('1');
    expect(screen.getByTestId('pageSize')).toHaveTextContent('5');

    // Executa callbacks padrão sem lançar exceções
    screen.getByRole('button', { name: 'Buscar' }).click();
    screen.getByRole('button', { name: 'CarregarFallback' }).click();
    screen.getByRole('button', { name: 'Limpar' }).click();
  });

  it('C02: onClickBuscar valida formulário, pesquisa acervos e atualiza estado em sucesso', async () => {
    mockedPesquisarAcervos.mockResolvedValue({
      sucesso: true,
      dados: {
        items: [{ id: 1, titulo: 'Acervo Educação', tipo: TipoAcervo.Bibliografico }],
        totalRegistros: 12,
      },
    });

    render(
      <MemoryRouter initialEntries={['/outra-rota']}>
        <ConsultaAcervoContextProvider>
          <ConsumerHarness />
        </ConsultaAcervoContextProvider>
      </MemoryRouter>,
    );

    await act(async () => {
      screen.getByRole('button', { name: 'Buscar' }).click();
    });

    await waitFor(() => {
      expect(mockedPesquisarAcervos).toHaveBeenCalledWith(1, 5, {
        textoLivre: 'educacao',
        tipoAcervo: TipoAcervo.Bibliografico,
      });
    });

    expect(screen.getByTestId('location-path')).toHaveTextContent(ROUTES.CONSULTA_ACERVO);
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('texto')).toHaveTextContent('educacao');
    expect(screen.getByTestId('total')).toHaveTextContent('12');
    expect(screen.getByTestId('hideSingle')).toHaveTextContent('false');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('C03: carregarDados usa fallback de paginação e hideOnSinglePage=true quando totalRegistros é 0', async () => {
    mockedPesquisarAcervos.mockResolvedValue({
      sucesso: true,
      dados: {
        items: [],
        totalRegistros: 0,
      },
    });

    render(
      <MemoryRouter initialEntries={[ROUTES.CONSULTA_ACERVO]}>
        <ConsultaAcervoContextProvider>
          <ConsumerHarness />
        </ConsultaAcervoContextProvider>
      </MemoryRouter>,
    );

    await act(async () => {
      screen.getByRole('button', { name: 'CarregarFallback' }).click();
    });

    await waitFor(() => {
      expect(mockedPesquisarAcervos).toHaveBeenCalledWith(1, 5, { textoLivre: '' });
    });

    expect(screen.getByTestId('total')).toHaveTextContent('0');
    expect(screen.getByTestId('hideSingle')).toHaveTextContent('true');
  });

  it('C04: carregarDados limpa dataSource quando resposta retorna sucesso=false', async () => {
    mockedPesquisarAcervos
      .mockResolvedValueOnce({
        sucesso: true,
        dados: {
          items: [{ id: 2, titulo: 'Item Inicial', tipo: TipoAcervo.Fotografico }],
          totalRegistros: 1,
        },
      })
      .mockResolvedValueOnce({
        sucesso: false,
      });

    render(
      <MemoryRouter initialEntries={[ROUTES.CONSULTA_ACERVO]}>
        <ConsultaAcervoContextProvider>
          <ConsumerHarness />
        </ConsultaAcervoContextProvider>
      </MemoryRouter>,
    );

    await act(async () => {
      screen.getByRole('button', { name: 'Buscar' }).click();
    });

    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('1'));

    await act(async () => {
      screen.getByRole('button', { name: 'CarregarFallback' }).click();
    });

    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('0'));
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('C05/C06: limparDados reseta estado e navega apenas quando está na rota de detalhes', async () => {
    mockedPesquisarAcervos.mockResolvedValue({
      sucesso: true,
      dados: {
        items: [{ id: 3, titulo: 'Item Teste', tipo: TipoAcervo.Bibliografico }],
        totalRegistros: 1,
      },
    });

    const { unmount } = render(
      <MemoryRouter initialEntries={[ROUTES.CONSULTA_ACERVO]}>
        <ConsultaAcervoContextProvider>
          <ConsumerHarness />
        </ConsultaAcervoContextProvider>
      </MemoryRouter>,
    );

    await act(async () => {
      screen.getByRole('button', { name: 'Buscar' }).click();
    });

    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('1'));

    act(() => {
      screen.getByRole('button', { name: 'Limpar' }).click();
    });

    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('texto')).toHaveTextContent('');
    expect(screen.getByTestId('location-path')).toHaveTextContent(ROUTES.CONSULTA_ACERVO);

    unmount();

    render(
      <MemoryRouter initialEntries={[ROUTES.CONSULTA_ACERVO_DETALHES]}>
        <ConsultaAcervoContextProvider>
          <ConsumerHarness />
        </ConsultaAcervoContextProvider>
      </MemoryRouter>,
    );

    act(() => {
      screen.getByRole('button', { name: 'Limpar' }).click();
    });

    expect(screen.getByTestId('location-path')).toHaveTextContent(ROUTES.CONSULTA_ACERVO);
  });
});
