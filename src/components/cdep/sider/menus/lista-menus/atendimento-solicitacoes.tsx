import { FaClipboard } from 'react-icons/fa';
import { ROUTES } from '~/core/enum/routes';
import { MenuItemCDEPProps } from '..';
import { MenuEnum } from '~/core/enum/menu-enum';

export const MENU_ATENDIMENTO_SOLICITACOES: MenuItemCDEPProps = {
  key: MenuEnum.AtendimentoSolicitacoes,
  title: 'Atendimento de Solicitações',
  icon: <FaClipboard  size={24} />,
  children: [
    {
      key: MenuEnum.MeusDados,
      title: 'Atendimento de Solicitações',
      url: ROUTES.ATENDIMENTO_SOLICITACOES,
    },
  ],
};
