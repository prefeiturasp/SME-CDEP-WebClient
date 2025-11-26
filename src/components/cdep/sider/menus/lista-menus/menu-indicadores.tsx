import { FaChartBar } from 'react-icons/fa';
import { MenuEnum } from '~/core/enum/menu-enum';
import { PermissaoEnum } from '~/core/enum/permissao-enum';
import { ROUTES } from '~/core/enum/routes';
import { MenuItemCDEPProps } from '..';

export const MENU_INDICADORES: MenuItemCDEPProps = {
  key: MenuEnum.Indicadores,
  title: 'Indicadores',
  icon: <FaChartBar size={24} />,
  children: [
    {
      key: MenuEnum.Indicadores,
      title: 'Indicadores',
      url: ROUTES.INDICADORES,
      roles: {
        podeConsultar: PermissaoEnum.CadastroCredito_C,
        podeIncluir: PermissaoEnum.CadastroCredito_I,
        podeExcluir: PermissaoEnum.CadastroCredito_E,
        podeAlterar: PermissaoEnum.CadastroCredito_A,
      },
    },
  ],
};
