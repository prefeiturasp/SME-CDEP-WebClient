import BreadcrumbCDEP from '~/components/cdep/breadcrumb';

import { ROUTES } from '~/core/enum/routes';
import FormularioNovo from '../../components/form-novo';

const CreditoNovo: React.FC = () => {
  return (
    <>
      <BreadcrumbCDEP
        menu='Cadastros'
        paginaPai='Crédito'
        urlPaginaPai={ROUTES.CREDITO}
        paginaFilha='Novo'
      />
      <FormularioNovo
        rotaCancelar={ROUTES.CREDITO}
        rotaVoltar={ROUTES.CREDITO}
        titulo='Novo Crédito'
      ></FormularioNovo>
    </>
  );
};
export default CreditoNovo;
