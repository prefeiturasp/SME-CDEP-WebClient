import { createElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import FormConfigCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form/form-config';
import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes';
import { useAppSelector } from '~/core/hooks/use-redux';
import PageForbidden from '~/pages/403';
import PageNotFound from '~/pages/404';
import FormAcervo from '~/pages/cadastros/acervo/form';
import ImportarAcervo from '~/pages/cadastros/acervo/importar-acervo';
import ListAcervo from '~/pages/cadastros/acervo/list';
import Assunto from '~/pages/cadastros/assunto';
import Autor from '~/pages/cadastros/autor';
import Credito from '~/pages/cadastros/credito';
import Editora from '~/pages/cadastros/editora';
import SerieColecao from '~/pages/cadastros/serie-colecao';
import { ConsultaAcervo } from '~/pages/consulta-acervo';
import { DetalhesConsultaAcervo } from '~/pages/consulta-acervo/detalhes';
import { ListaCardsConsultaAcervo } from '~/pages/consulta-acervo/lista-cards-consulta-acervo';
import CriarConta from '~/pages/criar-conta';
import Home from '~/pages/home';
import Inicial from '~/pages/inicial';
import Login from '~/pages/login';
import MeusDados from '~/pages/meus-dados';
import EnviarSolicitacoes from '~/pages/operacoes/solicitacao';
import Principal from '~/pages/principal/index';
import RedefinirSenha from '~/pages/redefinir-senha';
import RedefinirSenhaToken from '~/pages/redefinir-senha-token';
import GuardAutenticacao from './config/guard/autenticacao';
import GuardPermissao from './config/guard/permissao';

const RoutesConfig = () => {
  const autenticado = useAppSelector((state) => state.auth.autenticado);

  const homePage = createElement(Home);
  const loginPage = createElement(Login);
  const criarContaPage = createElement(CriarConta);
  const pageNotFound = createElement(PageNotFound);
  const principalPage = createElement(Principal);
  const forbiddenPage = createElement(PageForbidden);
  const iniciallPage = createElement(Inicial);
  const meusDadosPage = createElement(MeusDados);
  const redefinirSenhaPage = createElement(RedefinirSenha);
  const redefinirSenhaTokenPage = createElement(RedefinirSenhaToken);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.CONSULTA_ACERVO} element={<ConsultaAcervo />}>
          <Route path='' element={<ListaCardsConsultaAcervo />} />
          <Route path={ROUTES.CONSULTA_ACERVO_DETALHES} element={<DetalhesConsultaAcervo />} />
        </Route>

        {autenticado ? (
          <Route element={<GuardAutenticacao />}>
            <Route path={ROUTES.PRINCIPAL} element={principalPage}>
              <Route path='*' element={pageNotFound} />
              <Route path={ROUTES.SEM_PERMISSAO} element={forbiddenPage} />
              <Route path={ROUTES.PRINCIPAL} element={iniciallPage} />
              <Route path={ROUTES.LOGIN} element={<Navigate to={ROUTES.PRINCIPAL} />} />
              <Route path={ROUTES.MEUS_DADOS} element={meusDadosPage} />

              <Route path={ROUTES.CREDITO}>
                <Route element={<GuardPermissao menuKey={MenuEnum.Credito} />}>
                  <Route path='' element={<Credito />} />
                </Route>
                <Route element={<GuardPermissao menuKey={MenuEnum.Credito} />}>
                  <Route path={ROUTES.CREDITO_NOVO} element={<FormConfigCadastrosAuxiliares />} />
                </Route>
                <Route element={<GuardPermissao menuKey={MenuEnum.Credito} />}>
                  <Route path={ROUTES.CREDITO_EDITAR} element={<FormConfigCadastrosAuxiliares />} />
                </Route>
              </Route>

              <Route path={ROUTES.AUTOR}>
                <Route element={<GuardPermissao menuKey={MenuEnum.Autor} />}>
                  <Route path='' element={<Autor />} />
                </Route>
                <Route element={<GuardPermissao menuKey={MenuEnum.Autor} />}>
                  <Route path={ROUTES.AUTOR_NOVO} element={<FormConfigCadastrosAuxiliares />} />
                </Route>
                <Route element={<GuardPermissao menuKey={MenuEnum.Autor} />}>
                  <Route path={ROUTES.AUTOR_EDITAR} element={<FormConfigCadastrosAuxiliares />} />
                </Route>
              </Route>

              <Route path={ROUTES.EDITORA}>
                <Route element={<GuardPermissao menuKey={MenuEnum.Editora} />}>
                  <Route path='' element={<Editora />} />
                </Route>
                <Route element={<GuardPermissao menuKey={MenuEnum.Editora} />}>
                  <Route path={ROUTES.EDITORA_NOVO} element={<FormConfigCadastrosAuxiliares />} />
                </Route>
                <Route element={<GuardPermissao menuKey={MenuEnum.Editora} />}>
                  <Route path={ROUTES.EDITORA_EDITAR} element={<FormConfigCadastrosAuxiliares />} />
                </Route>
              </Route>

              <Route path={ROUTES.ASSUNTO}>
                <Route element={<GuardPermissao menuKey={MenuEnum.Assunto} />}>
                  <Route path='' element={<Assunto />} />
                </Route>
                <Route element={<GuardPermissao menuKey={MenuEnum.Assunto} />}>
                  <Route path={ROUTES.ASSUNTO_NOVO} element={<FormConfigCadastrosAuxiliares />} />
                </Route>
                <Route element={<GuardPermissao menuKey={MenuEnum.Assunto} />}>
                  <Route path={ROUTES.ASSUNTO_EDITAR} element={<FormConfigCadastrosAuxiliares />} />
                </Route>
              </Route>

              <Route path={ROUTES.SERIE_COLECAO}>
                <Route element={<GuardPermissao menuKey={MenuEnum.SerieColecao} />}>
                  <Route path='' element={<SerieColecao />} />
                </Route>
                <Route element={<GuardPermissao menuKey={MenuEnum.SerieColecao} />}>
                  <Route
                    path={ROUTES.SERIE_COLECAO_NOVO}
                    element={<FormConfigCadastrosAuxiliares />}
                  />
                </Route>
                <Route element={<GuardPermissao menuKey={MenuEnum.SerieColecao} />}>
                  <Route
                    path={ROUTES.SERIE_COLECAO_EDITAR}
                    element={<FormConfigCadastrosAuxiliares />}
                  />
                </Route>
              </Route>

              <Route path={ROUTES.ACERVO}>
                <Route element={<GuardPermissao menuKey={MenuEnum.Acervo} />}>
                  <Route path='' element={<ListAcervo />} />
                </Route>
                <Route element={<GuardPermissao menuKey={MenuEnum.Acervo} />}>
                  <Route path={ROUTES.ACERVO_NOVO} element={<FormAcervo />} />
                </Route>
                <Route element={<GuardPermissao menuKey={MenuEnum.Acervo} />}>
                  <Route path={ROUTES.ACERVO_EDITAR} element={<FormAcervo />} />
                </Route>
                <Route element={<GuardPermissao menuKey={MenuEnum.Acervo} />}>
                  <Route path={ROUTES.ACERVO_IMPORTAR} element={<ImportarAcervo />} />
                </Route>
              </Route>

              <Route path={ROUTES.SOLICITACAO}>
                <Route element={<GuardPermissao menuKey={MenuEnum.Solicitacao} />}>
                  <Route path='' element={<EnviarSolicitacoes />} />
                </Route>
                <Route element={<GuardPermissao menuKey={MenuEnum.Solicitacao} />}>
                  <Route path={ROUTES.SOLICITACAO_EDITAR} element={<EnviarSolicitacoes />} />
                </Route>
              </Route>
            </Route>
          </Route>
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
