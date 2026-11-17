import { render, screen } from '@testing-library/react';
import React, { useContext, useEffect } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ROUTES } from '~/core/enum/routes';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { useAppDispatch } from '~/core/hooks/use-redux';
import { setAcervosSelecionados } from '~/core/redux/modules/solicitacao/actions';
import { ConsultaAcervo } from './index';
import { ConsultaAcervoContext } from './provider';

const mockDispatch = jest.fn();

jest.mock('~/core/hooks/use-redux', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('~/components/lib/header', () => ({
  __esModule: true,
  default: ({ logo }: { logo: React.ReactNode }) => (
    <header data-testid='cdep-header'>{logo}</header>
  ),
}));

jest.mock('./filtro-consulta-acervo', () => ({
  FiltroConsultaAcervo: () => <div data-testid='filtro-consulta-acervo' />,
}));

jest.mock('./components/button-enviar-para-minha-selecao', () => ({
  ButtonEnviarParaMinhaSelecao: () => <button type='button'>Enviar para minha seleção</button>,
}));

const PopulateDataSourceOutlet: React.FC<{ populate: boolean }> = ({ populate }) => {
  const { setDataSource } = useContext(ConsultaAcervoContext);

  useEffect(() => {
    if (populate && setDataSource) {
      setDataSource([
        { id: 1, titulo: 'Item', tipo: TipoAcervo.Bibliografico } as unknown as PesquisaAcervoDTO,
      ]);
    }
  }, [populate, setDataSource]);

  return <div data-testid='outlet-content'>Conteúdo Outlet</div>;
};

describe('ConsultaAcervo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('C16/C17: despacha limpeza inicial de seleção e oculta StickyButtonEnviar quando dataSource está vazio', () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.CONSULTA_ACERVO]}>
        <Routes>
          <Route path={ROUTES.CONSULTA_ACERVO} element={<ConsultaAcervo />}>
            <Route index element={<PopulateDataSourceOutlet populate={false} />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(mockDispatch).toHaveBeenCalledWith(setAcervosSelecionados([]));
    expect(screen.getByTestId('cdep-header')).toBeInTheDocument();
    expect(screen.getByAltText('CDEP LOGO HORIZONTAL')).toBeInTheDocument();
    expect(screen.getByTestId('filtro-consulta-acervo')).toBeInTheDocument();
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Enviar para minha seleção' }),
    ).not.toBeInTheDocument();
  });

  it('C17b: oculta StickyButtonEnviar quando fora da rota CONSULTA_ACERVO mesmo com dataSource preenchido', () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.CONSULTA_ACERVO_DETALHES]}>
        <Routes>
          <Route element={<ConsultaAcervo />}>
            <Route
              path={ROUTES.CONSULTA_ACERVO_DETALHES}
              element={<PopulateDataSourceOutlet populate />}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Enviar para minha seleção' }),
    ).not.toBeInTheDocument();
  });

  it('C18: exibe StickyButtonEnviar na rota CONSULTA_ACERVO quando dataSource possui itens', () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.CONSULTA_ACERVO]}>
        <Routes>
          <Route path={ROUTES.CONSULTA_ACERVO} element={<ConsultaAcervo />}>
            <Route index element={<PopulateDataSourceOutlet populate />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: 'Enviar para minha seleção' })).toBeInTheDocument();
  });
});
