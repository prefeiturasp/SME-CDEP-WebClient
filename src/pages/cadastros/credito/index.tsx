import ListCadastrosAuxiliares, {
  ListConfigCadastros,
} from '~/components/cdep/cadastros/auxiliares/list/list';
import { ROUTES } from '~/core/enum/routes';
import { TipoCreditoAutoria } from '~/core/enum/tipo-credito-autoria';
import { URL_API_CREDITO_AUTOR } from '~/core/services/credito-autor';

const Credito: React.FC = () => {
  const paramsConfigPage: ListConfigCadastros = {
    breadcrumb: {
      urlMainPage: ROUTES.CREDITO,
    },
    page: {
      title: 'Crédito',
      urlApiBase: `${URL_API_CREDITO_AUTOR}?tipo=${TipoCreditoAutoria.Credito}`,
    },
  };

  return <ListCadastrosAuxiliares {...paramsConfigPage} />;
};

export default Credito;
