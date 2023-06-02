import { Routes as BaseRoutes, Route, Navigate } from 'react-router-dom';
import { createElement } from 'react';

import Login from '~/pages/login';
import { ROUTES } from '~/core/enum/routes';

const Routes = () => {
  const loginPage = createElement(Login);

  return (
    <BaseRoutes>
      <Route path='*' element={<Navigate to={ROUTES.LOGIN} />} />
      <Route path={ROUTES.LOGIN} element={loginPage} />
    </BaseRoutes>
  );
};

export default Routes;
