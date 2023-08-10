import BreadcrumbCDEP from '~/components/cdep/breadcrumb';

import { ROUTES } from '~/core/enum/routes';
import FormularioNovo from '../../components/form-novo';

const CreditoNovo: React.FC = () => {
  return (
    <>
      <BreadcrumbCDEP
        menu='Cadastros'
        paginaPai='Editora'
        urlPaginaPai={ROUTES.EDITORA}
        paginaFilha='Nova'
      />
      <FormularioNovo
        rotaCancelar={ROUTES.EDITORA}
        rotaVoltar={ROUTES.EDITORA}
        titulo='Nova Editora'
      ></FormularioNovo>
    </>
  );
};
export default CreditoNovo;
