import ListCadastrosAuxiliares, {
  ListConfigCadastros,
} from '~/components/cdep/cadastros/auxiliares/list/list';
import { ROUTES } from '~/core/enum/routes';
import { URL_API_CREDITO_AUTOR } from '~/core/services/credito-autor';

const Autor: React.FC = () => {
  const paramsConfigPage: ListConfigCadastros = {
    breadcrumb: {
      urlMainPage: ROUTES.AUTOR,
    },
    page: {
      title: 'Autor',
      urlApiBase: URL_API_CREDITO_AUTOR,
    },
  };

  return <ListCadastrosAuxiliares {...paramsConfigPage} />;
};

export default Autor;
