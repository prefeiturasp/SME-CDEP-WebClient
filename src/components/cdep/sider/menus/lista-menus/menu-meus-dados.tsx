import { FaUser } from 'react-icons/fa';
import { ROUTES } from '~/core/enum/routes';
import { MenuItemCDEPProps } from '..';
import { MenuEnum } from '~/core/enum/menu-enum';

export const MENU_MEUS_DADOS: MenuItemCDEPProps = {
  key: MenuEnum.MeusDados,
  title: 'Meus dados',
  icon: <FaUser size={24} />,
  children: [
    {
      key: MenuEnum.MeusDados,
      title: 'Meus Dados',
      url: ROUTES.MEUS_DADOS,
    },
  ],
};
