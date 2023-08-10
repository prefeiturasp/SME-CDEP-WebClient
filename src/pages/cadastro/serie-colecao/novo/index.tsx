import BreadcrumbCDEP from '~/components/cdep/breadcrumb';

import { ROUTES } from '~/core/enum/routes';
import FormularioNovo from '../../components/form-novo';

const CreditoNovo: React.FC = () => {
  return (
    <>
      <BreadcrumbCDEP
        menu='Cadastros'
        paginaPai='Série/Coleção'
        urlPaginaPai={ROUTES.SERIE_COLECAO}
        paginaFilha='Novo'
      />
      <FormularioNovo
        rotaCancelar={ROUTES.SERIE_COLECAO}
        rotaVoltar={ROUTES.SERIE_COLECAO}
        titulo='Série/Coleção'
      ></FormularioNovo>
    </>
  );
};
export default CreditoNovo;
