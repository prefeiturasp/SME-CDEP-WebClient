import { FaClipboard } from 'react-icons/fa';
import { ROUTES } from '~/core/enum/routes';
import { MenuItemCDEPProps } from '..';
import { MenuEnum } from '~/core/enum/menu-enum';
import { PermissaoEnum } from '~/core/enum/permissao-enum';

export const MENU_GESTAO: MenuItemCDEPProps = {
  key: MenuEnum.Gestao,
  title: 'Gestão',
  icon: <FaClipboard size={24} />,
  children: [
    {
      key: MenuEnum.AtendimentoSolicitacoes,
      title: 'Atendimento de Solicitações',
      url: ROUTES.ATENDIMENTO_SOLICITACOES,
      roles: {
        podeConsultar: PermissaoEnum.OperacoesAtendimento_C,
        podeIncluir: PermissaoEnum.OperacoesAtendimento_I,
        podeExcluir: PermissaoEnum.OperacoesAtendimento_E,
        podeAlterar: PermissaoEnum.OperacoesAtendimento_A,
      },
    },
  ],
};
