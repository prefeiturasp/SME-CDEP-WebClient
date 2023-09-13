import ListCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/list/list';
import { paramsConfigPageListSerieColecao } from '~/core/constants/config-page-cadastros-auxiliares';

const SerieColecao: React.FC = () => (
  <ListCadastrosAuxiliares {...paramsConfigPageListSerieColecao} />
);
export default SerieColecao;
