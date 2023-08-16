import ListCadastrosAuxiliares, {
  ListConfigCadastros,
} from '~/components/cdep/cadastros/auxiliares/list/list';
import { ROUTES } from '~/core/enum/routes';

const Assunto: React.FC = () => {
  const paramsConfigPage: ListConfigCadastros = {
    breadcrumb: {
      urlMainPage: ROUTES.ASSUNTO,
    },
    page: {
      title: 'Assunto',
      urlApiBase: 'v1/assunto',
    },
  };

  return <ListCadastrosAuxiliares {...paramsConfigPage} />;
};

export default Assunto;
