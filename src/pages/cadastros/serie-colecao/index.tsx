import ListCadastrosAuxiliares, {
  ListConfigCadastros,
} from '~/components/cdep/cadastros/auxiliares/list/list';
import { ROUTES } from '~/core/enum/routes';

const SerieColecao: React.FC = () => {
  const paramsConfigPage: ListConfigCadastros = {
    breadcrumb: {
      urlMainPage: ROUTES.SERIE_COLECAO,
    },
    page: {
      title: 'Série/Coleção',
      urlApiBase: 'v1/seriecolecao',
    },
  };

  return <ListCadastrosAuxiliares {...paramsConfigPage} />;
};

export default SerieColecao;
