import BreadcrumbCDEP from '~/components/cdep/breadcrumb';

import { ROUTES } from '~/core/enum/routes';
import FormularioNovo from '../../components/form-novo';

const CreditoNovo: React.FC = () => {
  return (
    <>
      <BreadcrumbCDEP
        menu='Cadastros'
        paginaPai='Assunto'
        urlPaginaPai={ROUTES.ASSUNTO}
        paginaFilha='Novo'
      />
      <FormularioNovo
        rotaCancelar={ROUTES.ASSUNTO}
        rotaVoltar={ROUTES.ASSUNTO}
        titulo='Assunto'
      ></FormularioNovo>
    </>
  );
};
export default CreditoNovo;
