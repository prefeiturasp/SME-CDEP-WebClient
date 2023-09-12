import { ROUTES } from '~/core/enum/routes';

import { useLocation } from 'react-router-dom';
import { INPUTS_NAMES } from '~/core/constants/inputs-cadastros';
import { FormCadastrosAuxiliaresProps } from '~/core/dto/form-cadastros-auxiliares';
import { TipoCreditoAutoria } from '~/core/enum/tipo-credito-autoria';
import { URL_API_CREDITO_AUTOR } from '~/core/services/credito-autor';
import FormCadastrosAuxiliares from '.';

const FormConfigCadastrosAuxiliares: React.FC = () => {
  const location = useLocation();

  const pathname = location.pathname;

  const paramsConfigPage: FormCadastrosAuxiliaresProps[] = [
    {
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
    },
    {
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
    },
    {
      page: {
        title: 'Editora',
        urlBase: 'v1/editora',
        urlMainPage: ROUTES.EDITORA,
        inputs: [
          {
            name: INPUTS_NAMES.TEXT.NOME,
            placeholder: 'Informe o nome da editora da obra',
          },
        ],
      },
    },
    {
      page: {
        title: 'Assunto',
        urlBase: 'v1/assunto',
        urlMainPage: ROUTES.ASSUNTO,
        inputs: [
          {
            name: INPUTS_NAMES.TEXT.NOME,
            placeholder: 'Informe o título do assunto',
          },
        ],
      },
    },
    {
      page: {
        title: 'Série/Coleção',
        urlBase: 'v1/seriecolecao',
        urlMainPage: ROUTES.SERIE_COLECAO,
        inputs: [
          {
            name: INPUTS_NAMES.TEXT.NOME,
            placeholder: 'Informe o título da série ou coleção',
          },
        ],
      },
    },
  ];

  const getFormParams = (): FormCadastrosAuxiliaresProps | undefined => {
    const configAtual = paramsConfigPage.find((item: FormCadastrosAuxiliaresProps) =>
      pathname.includes(item.page.urlMainPage),
    );

    return configAtual;
  };

  const formParams = getFormParams();

  if (!formParams) return <></>;

  return <FormCadastrosAuxiliares {...formParams} />;
};
export default FormConfigCadastrosAuxiliares;
