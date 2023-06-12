import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { createElement } from 'react';

import Login from '~/pages/login';
import { ROUTES } from '~/core/enum/routes';
import PagNotFound from '~/pages/404';
import { useAppSelector } from '~/core/hooks/use-redux';
import Auth from './config/auth';
import Principal from '~/pages/principal/index';
import MeusDados from '~/pages/meus-dados';
import Inicial from '~/pages/inicial';

const RoutesConfig = () => {
  const autenticado = useAppSelector((state) => state.auth.autenticado);

  const loginPage = createElement(Login);
  const pagNotFound = createElement(PagNotFound);
  const principalPage = createElement(Principal);
  const iniciallPage = createElement(Inicial);
  const meusDadosPage = createElement(MeusDados);

  return (
    <BrowserRouter>
      {autenticado ? (
        <>
          <Routes>
            <Route path={ROUTES.PRINCIPAL} element={principalPage}>
              <Route element={<Auth />}>
                <Route path={ROUTES.PRINCIPAL} element={iniciallPage} />
                <Route path={ROUTES.MEUS_DADOS} element={meusDadosPage} />
                <Route path='*' element={pagNotFound} />
                <Route path={ROUTES.LOGIN} element={<Navigate to={ROUTES.PRINCIPAL} />} />
              </Route>
            </Route>
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path='*' element={<Navigate to={ROUTES.LOGIN} />} />
          <Route path={ROUTES.LOGIN} element={loginPage} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default RoutesConfig;
