import { MenuItemSMEProps } from '~/components/lib/sider';
import { RolesDTO } from '~/core/dto/roles-menu-dto';
import { MenuEnum } from '~/core/enum/menu-enum';
import { PermissaoEnum } from '~/core/enum/permissao-enum';
import { MENU_CADASTRO } from './lista-menus/menu-cadastros';
import { MENU_GESTAO } from './lista-menus/menu-gestao';
import { MENU_MEUS_DADOS } from './lista-menus/menu-meus-dados';
import { MENU_OPERACOES } from './lista-menus/menu-operacoes';
import { MENU_RELATORIOS } from './lista-menus/menu-relatorios';

export interface RolesMenu {
  podeConsultar: PermissaoEnum;
  podeIncluir: PermissaoEnum;
  podeAlterar: PermissaoEnum;
  podeExcluir: PermissaoEnum;
  customRoles?: RolesDTO['roles'];
}

export interface MenuItemCDEPProps extends MenuItemSMEProps {
  key: MenuEnum;
  roles?: RolesMenu;
  children?: MenuItemCDEPProps[];
}

export const menus: MenuItemCDEPProps[] = [
  MENU_MEUS_DADOS,
  MENU_CADASTRO,
  MENU_OPERACOES,
  MENU_GESTAO,
  MENU_RELATORIOS,
];
