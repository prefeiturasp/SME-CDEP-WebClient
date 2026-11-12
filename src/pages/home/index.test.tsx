import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Home from './index';

describe('Home', () => {
  it('deve renderizar os logos do CDEP e da Prefeitura de SP', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const logoCdep = screen.getByAltText('CDEP LOGO');
    expect(logoCdep).toBeInTheDocument();

    const logoPrefeitura = screen.getByAltText('PREFEITURA SP LOGO');
    expect(logoPrefeitura).toBeInTheDocument();
  });

  it('deve renderizar o Outlet com o conteúdo da rota filha', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path='/' element={<Home />}>
            <Route index element={<div>Conteúdo da Rota Filha</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Conteúdo da Rota Filha')).toBeInTheDocument();
  });
});
