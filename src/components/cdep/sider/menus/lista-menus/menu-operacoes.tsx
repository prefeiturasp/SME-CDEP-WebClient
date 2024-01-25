import { FaListUl } from 'react-icons/fa';
import { MenuEnum } from '~/core/enum/menu-enum';
import { PermissaoEnum } from '~/core/enum/permissao-enum';
import { ROUTES } from '~/core/enum/routes';
import { MenuItemCDEPProps } from '..';

export const MENU_OPERACOES: MenuItemCDEPProps = {
  key: MenuEnum.Operacoes,
  title: 'Operações',
  icon: <FaListUl size={24} />,
  children: [
    {
      key: MenuEnum.Solicitacao,
      title: 'Solicitação',
      url: ROUTES.SOLICITACAO,
      roles: {
        podeConsultar: PermissaoEnum.OperacoesSolicitacoes_C,
        podeIncluir: PermissaoEnum.OperacoesSolicitacoes_I,
        podeExcluir: PermissaoEnum.OperacoesSolicitacoes_E,
        podeAlterar: PermissaoEnum.OperacoesSolicitacoes_A,
      },
    },
  ],
};
