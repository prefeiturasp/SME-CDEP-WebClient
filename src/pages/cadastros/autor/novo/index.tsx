import BreadcrumbCDEP from '~/components/cdep/breadcrumb';

import { ROUTES } from '~/core/enum/routes';
import FormularioNovo from '../../components/form-novo';

const CreditoNovo: React.FC = () => {
  return (
    <>
      <BreadcrumbCDEP
        menu='Cadastros'
        paginaPai='Autor'
        urlPaginaPai={ROUTES.AUTOR}
        paginaFilha='Novo'
      />
      <FormularioNovo
        rotaCancelar={ROUTES.AUTOR}
        rotaVoltar={ROUTES.AUTOR}
        titulo='Novo Autor'
      ></FormularioNovo>
    </>
  );
};
export default CreditoNovo;
