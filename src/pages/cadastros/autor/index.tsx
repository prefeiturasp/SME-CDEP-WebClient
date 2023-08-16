import ListCadastrosAuxiliares, {
  ListConfigCadastros,
} from '~/components/cdep/cadastros/auxiliares/list/list';
import { ROUTES } from '~/core/enum/routes';

const Autor: React.FC = () => {
  const paramsConfigPage: ListConfigCadastros = {
    breadcrumb: {
      urlMainPage: ROUTES.AUTOR,
    },
    page: {
      title: 'Autor',
      urlApiBase: 'v1/autor',
    },
  };

  return <ListCadastrosAuxiliares {...paramsConfigPage} />;
};

export default Autor;
