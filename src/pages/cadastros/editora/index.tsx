import ListCadastrosAuxiliares, {
  ListConfigCadastros,
} from '~/components/cdep/cadastros/auxiliares/list/list';
import { ROUTES } from '~/core/enum/routes';

const Editora: React.FC = () => {
  const paramsConfigPage: ListConfigCadastros = {
    breadcrumb: {
      urlMainPage: ROUTES.EDITORA,
    },
    page: {
      title: 'Editora',
      urlApiBase: 'v1/editora',
    },
  };

  return <ListCadastrosAuxiliares {...paramsConfigPage} />;
};

export default Editora;
