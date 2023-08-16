import { ROUTES } from '~/core/enum/routes';

import { useLocation, useParams } from 'react-router-dom';
import FormCadastrosAuxiliares, { FormConfigCadastros } from '.';
import { INPUTS_NAMES } from '~/core/constants/inputs-cadastros';

const FormConfigCadastrosAuxiliares: React.FC = () => {
  const paramsRoute = useParams();
  const location = useLocation();

  const pathname = location.pathname;

  const paramsConfigPage: FormConfigCadastros[] = [
    {
      breadcrumb: {
        mainPage: 'Crédito',
        urlMainPage: ROUTES.CREDITO,
        title: paramsRoute?.id ? 'Editar' : 'Novo',
      },
      page: {
        title: 'Crédito',
        urlBase: 'v1/credito',
        inputs: [
          {
            name: INPUTS_NAMES.TEXT.NOME,
            placeholder: 'Informe o nome do crédito',
          },
        ],
      },
    },
    {
      breadcrumb: {
        mainPage: 'Autor',
        urlMainPage: ROUTES.AUTOR,
        title: paramsRoute?.id ? 'Editar' : 'Novo',
      },
      page: {
        title: 'Autor',
        urlBase: 'v1/autor',
        inputs: [
          {
            name: INPUTS_NAMES.TEXT.NOME,
            placeholder: 'Informe o nome do autor da obra',
          },
        ],
      },
    },
    {
      breadcrumb: {
        mainPage: 'Editora',
        urlMainPage: ROUTES.EDITORA,
        title: paramsRoute?.id ? 'Editar' : 'Novo',
      },
      page: {
        title: 'Editora',
        urlBase: 'v1/editora',
        inputs: [
          {
            name: INPUTS_NAMES.TEXT.NOME,
            placeholder: 'Informe o nome da editora da obra',
          },
        ],
      },
    },
    {
      breadcrumb: {
        mainPage: 'Assunto',
        urlMainPage: ROUTES.ASSUNTO,
        title: paramsRoute?.id ? 'Editar' : 'Novo',
      },
      page: {
        title: 'Assunto',
        urlBase: 'v1/assunto',
        inputs: [
          {
            name: INPUTS_NAMES.TEXT.NOME,
            placeholder: 'Informe o título do assunto',
          },
        ],
      },
    },
    {
      breadcrumb: {
        mainPage: 'Série/Coleção',
        urlMainPage: ROUTES.SERIE_COLECAO,
        title: paramsRoute?.id ? 'Editar' : 'Novo',
      },
      page: {
        title: 'Série/Coleção',
        urlBase: 'v1/seriecolecao',
        inputs: [
          {
            name: INPUTS_NAMES.TEXT.NOME,
            placeholder: 'Informe o título da série ou coleção',
          },
        ],
      },
    },
  ];

  const getFormParams = (): FormConfigCadastros | undefined => {
    const configAtual = paramsConfigPage.find((item: FormConfigCadastros) =>
      pathname.includes(item.breadcrumb.urlMainPage),
    );

    return configAtual;
  };

  const formParams = getFormParams();

  if (!formParams) return <></>;

  return <FormCadastrosAuxiliares {...formParams} />;
};
export default FormConfigCadastrosAuxiliares;
