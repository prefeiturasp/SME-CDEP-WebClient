import { createElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import FormConfigCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form/form-config';
import { ROUTES } from '~/core/enum/routes';
import { useAppSelector } from '~/core/hooks/use-redux';
import PagNotFound from '~/pages/404';
import FormAcervo from '~/pages/cadastros/acervo/form';
import ListAcervo from '~/pages/cadastros/acervo/list';
import Assunto from '~/pages/cadastros/assunto';
import Autor from '~/pages/cadastros/autor';
import Credito from '~/pages/cadastros/credito';
import Editora from '~/pages/cadastros/editora';
import SerieColecao from '~/pages/cadastros/serie-colecao';
import { ConsultaAcervo } from '~/pages/consulta-acervo';
import CriarConta from '~/pages/criar-conta';
import Home from '~/pages/home';
import Inicial from '~/pages/inicial';
import Login from '~/pages/login';
import MeusDados from '~/pages/meus-dados';
import Principal from '~/pages/principal/index';
import RedefinirSenha from '~/pages/redefinir-senha';
import RedefinirSenhaToken from '~/pages/redefinir-senha-token';
import Auth from './config/auth';
import ImportarAcervo from '~/pages/cadastros/acervo/importar-acervo';

const RoutesConfig = () => {
  const autenticado = useAppSelector((state) => state.auth.autenticado);

  const homePage = createElement(Home);
  const loginPage = createElement(Login);
  const criarContaPage = createElement(CriarConta);
  const pagNotFound = createElement(PagNotFound);
  const principalPage = createElement(Principal);
  const iniciallPage = createElement(Inicial);
  const meusDadosPage = createElement(MeusDados);
  const redefinirSenhaPage = createElement(RedefinirSenha);
  const redefinirSenhaTokenPage = createElement(RedefinirSenhaToken);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.CONSULTA_ACERVO} element={<ConsultaAcervo />} />

        {autenticado ? (
          <>
            <Route path={ROUTES.PRINCIPAL} element={principalPage}>
              <Route element={<Auth />}>
                <Route path={ROUTES.PRINCIPAL} element={iniciallPage} />
                <Route path={ROUTES.MEUS_DADOS} element={meusDadosPage} />

                <Route path={ROUTES.CREDITO}>
                  <Route path='' element={<Credito />} />
                  <Route path={ROUTES.CREDITO_NOVO} element={<FormConfigCadastrosAuxiliares />} />
                  <Route path={ROUTES.CREDITO_EDITAR} element={<FormConfigCadastrosAuxiliares />} />
                </Route>
                <Route path={ROUTES.AUTOR}>
                  <Route path='' element={<Autor />} />
                  <Route path={ROUTES.AUTOR_NOVO} element={<FormConfigCadastrosAuxiliares />} />
                  <Route path={ROUTES.AUTOR_EDITAR} element={<FormConfigCadastrosAuxiliares />} />
                </Route>
                <Route path={ROUTES.EDITORA}>
                  <Route path='' element={<Editora />} />
                  <Route path={ROUTES.EDITORA_NOVO} element={<FormConfigCadastrosAuxiliares />} />
                  <Route path={ROUTES.EDITORA_EDITAR} element={<FormConfigCadastrosAuxiliares />} />
                </Route>
                <Route path={ROUTES.ASSUNTO}>
                  <Route path='' element={<Assunto />} />
                  <Route path={ROUTES.ASSUNTO_NOVO} element={<FormConfigCadastrosAuxiliares />} />
                  <Route path={ROUTES.ASSUNTO_EDITAR} element={<FormConfigCadastrosAuxiliares />} />
                </Route>
                <Route path={ROUTES.SERIE_COLECAO}>
                  <Route path='' element={<SerieColecao />} />
                  <Route
                    path={ROUTES.SERIE_COLECAO_NOVO}
                    element={<FormConfigCadastrosAuxiliares />}
                  />
                  <Route
                    path={ROUTES.SERIE_COLECAO_EDITAR}
                    element={<FormConfigCadastrosAuxiliares />}
                  />
                </Route>
                <Route path={ROUTES.ACERVO}>
                  <Route path='' element={<ListAcervo />} />
                  <Route path={ROUTES.ACERVO_NOVO} element={<FormAcervo />} />
                  <Route path={ROUTES.ACERVO_EDITAR} element={<FormAcervo />} />
                  <Route path={ROUTES.ACERVO_IMPORTAR} element={<ImportarAcervo />} />
                </Route>
                <Route path='*' element={pagNotFound} />
                <Route path={ROUTES.LOGIN} element={<Navigate to={ROUTES.PRINCIPAL} />} />
              </Route>
            </Route>
          </>
        ) : (
          <>
            <Route path='*' element={<Navigate to={ROUTES.LOGIN} />} />
            <Route element={homePage}>
              <Route path={ROUTES.LOGIN} element={loginPage} />
              <Route path={ROUTES.CRIAR_CONTA} element={criarContaPage} />
              <Route path={ROUTES.REDEFINIR_SENHA} element={redefinirSenhaPage} />
              <Route path={ROUTES.REDEFINIR_SENHA_TOKEN} element={redefinirSenhaTokenPage} />
            </Route>
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesConfig;
