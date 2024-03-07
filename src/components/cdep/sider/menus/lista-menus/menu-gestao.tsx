import { FaCalendarAlt } from 'react-icons/fa';
import { MenuEnum } from '~/core/enum/menu-enum';
import { PermissaoEnum } from '~/core/enum/permissao-enum';
import { ROUTES } from '~/core/enum/routes';
import { MenuItemCDEPProps } from '..';

export const MENU_GESTAO: MenuItemCDEPProps = {
  key: MenuEnum.Gestao,
  title: 'Gestão',
  icon: <FaCalendarAlt size={24} />,
  children: [
    {
      key: MenuEnum.Calendario,
      title: 'Calendário',
      url: ROUTES.CALENDARIO,
      roles: {
        podeConsultar: PermissaoEnum.GestaoDeVisitaCalendario_C,
        podeIncluir: PermissaoEnum.GestaoDeVisitaCalendario_I,
        podeExcluir: PermissaoEnum.GestaoDeVisitaCalendario_E,
        podeAlterar: PermissaoEnum.GestaoDeVisitaCalendario_A,
      },
    },
  ],
};
