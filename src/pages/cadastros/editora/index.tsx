import ListCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/list/list';
import { paramsConfigPageListEditora } from '~/core/constants/config-page-cadastros-auxiliares';

const Editora: React.FC = () => <ListCadastrosAuxiliares {...paramsConfigPageListEditora} />;

export default Editora;
