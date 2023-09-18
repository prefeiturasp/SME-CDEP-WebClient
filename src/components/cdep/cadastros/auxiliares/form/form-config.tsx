import { useLocation } from 'react-router-dom';
import {
  paramsConfigPageFormAssunto,
  paramsConfigPageFormAutor,
  paramsConfigPageFormCredito,
  paramsConfigPageFormEditora,
  paramsConfigPageFormSerieColecao,
} from '~/core/constants/config-page-cadastros-auxiliares';
import { FormCadastrosAuxiliaresProps } from '~/core/dto/form-cadastros-auxiliares';
import FormCadastrosAuxiliares from '.';

const FormConfigCadastrosAuxiliares: React.FC = () => {
  const location = useLocation();

  const pathname = location.pathname;

  const paramsConfigPage: FormCadastrosAuxiliaresProps[] = [
    paramsConfigPageFormCredito,
    paramsConfigPageFormAutor,
    paramsConfigPageFormEditora,
    paramsConfigPageFormAssunto,
    paramsConfigPageFormSerieColecao,
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
