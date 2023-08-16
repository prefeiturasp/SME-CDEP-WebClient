import ListCadastrosAuxiliares, {
  ListConfigCadastros,
} from '~/components/cdep/cadastros/auxiliares/list/list';
import { ROUTES } from '~/core/enum/routes';

const Credito: React.FC = () => {
  const paramsConfigPage: ListConfigCadastros = {
    breadcrumb: {
      urlMainPage: ROUTES.CREDITO,
    },
    page: {
      title: 'Crédito',
      urlApiBase: 'v1/credito',
    },
  };

  return <ListCadastrosAuxiliares {...paramsConfigPage} />;
};

export default Credito;
