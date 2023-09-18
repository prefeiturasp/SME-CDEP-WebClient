import { ListConfigCadastrosAuxiliaresProps } from '~/components/cdep/cadastros/auxiliares/list/list';
import { FormCadastrosAuxiliaresProps } from '../dto/form-cadastros-auxiliares';
import { ROUTES } from '../enum/routes';
import { TipoCreditoAutoria } from '../enum/tipo-credito-autoria';

import { INPUTS_NAMES } from './inputs-cadastros';
import {
  URL_API_ASSUNTO,
  URL_API_CREDITO_AUTOR,
  URL_API_EDITORA,
  URL_API_SERIE_COLECAO,
} from './urls-api';

export const paramsConfigPageFormCredito: FormCadastrosAuxiliaresProps = {
  page: {
    title: 'Crédito',
    urlMainPage: ROUTES.CREDITO,
    urlBase: URL_API_CREDITO_AUTOR,
    inputs: [
      {
        name: INPUTS_NAMES.TEXT.NOME,
        placeholder: 'Informe o nome do crédito',
      },
    ],
  },
  initialValues: { tipo: TipoCreditoAutoria.Credito },
};
export const paramsConfigPageListCredito: ListConfigCadastrosAuxiliaresProps = {
  breadcrumb: {
    urlMainPage: ROUTES.CREDITO,
  },
  page: {
    title: 'Crédito',
    urlApiBase: `${URL_API_CREDITO_AUTOR}?tipo=${TipoCreditoAutoria.Credito}`,
  },
};

export const paramsConfigPageFormAutor: FormCadastrosAuxiliaresProps = {
  page: {
    title: 'Autor',
    urlMainPage: ROUTES.AUTOR,
    urlBase: URL_API_CREDITO_AUTOR,
    inputs: [
      {
        name: INPUTS_NAMES.TEXT.NOME,
        placeholder: 'Informe o nome do autor da obra',
      },
    ],
  },
  initialValues: { tipo: TipoCreditoAutoria.Autoria },
};

export const paramsConfigPageListAutor: ListConfigCadastrosAuxiliaresProps = {
  breadcrumb: {
    urlMainPage: ROUTES.AUTOR,
  },
  page: {
    title: 'Autor',
    urlApiBase: `${URL_API_CREDITO_AUTOR}?tipo=${TipoCreditoAutoria.Autoria}`,
  },
};

export const paramsConfigPageFormEditora: FormCadastrosAuxiliaresProps = {
  page: {
    title: 'Editora',
    urlBase: URL_API_EDITORA,
    urlMainPage: ROUTES.EDITORA,
    inputs: [
      {
        name: INPUTS_NAMES.TEXT.NOME,
        placeholder: 'Informe o nome da editora da obra',
      },
    ],
  },
};

export const paramsConfigPageListEditora: ListConfigCadastrosAuxiliaresProps = {
  breadcrumb: {
    urlMainPage: ROUTES.EDITORA,
  },
  page: {
    title: 'Editora',
    urlApiBase: URL_API_EDITORA,
  },
};

export const paramsConfigPageFormAssunto: FormCadastrosAuxiliaresProps = {
  page: {
    title: 'Assunto',
    urlBase: URL_API_ASSUNTO,
    urlMainPage: ROUTES.ASSUNTO,
    inputs: [
      {
        name: INPUTS_NAMES.TEXT.NOME,
        placeholder: 'Informe o título do assunto',
      },
    ],
  },
};

export const paramsConfigPageListAssunto: ListConfigCadastrosAuxiliaresProps = {
  breadcrumb: {
    urlMainPage: ROUTES.ASSUNTO,
  },
  page: {
    title: 'Assunto',
    urlApiBase: URL_API_ASSUNTO,
  },
};

export const paramsConfigPageFormSerieColecao: FormCadastrosAuxiliaresProps = {
  page: {
    title: 'Série/Coleção',
    urlBase: URL_API_SERIE_COLECAO,
    urlMainPage: ROUTES.SERIE_COLECAO,
    inputs: [
      {
        name: INPUTS_NAMES.TEXT.NOME,
        placeholder: 'Informe o título da série ou coleção',
      },
    ],
  },
};

export const paramsConfigPageListSerieColecao: ListConfigCadastrosAuxiliaresProps = {
  breadcrumb: {
    urlMainPage: ROUTES.SERIE_COLECAO,
  },
  page: {
    title: 'Série/Coleção',
    urlApiBase: URL_API_SERIE_COLECAO,
  },
};
