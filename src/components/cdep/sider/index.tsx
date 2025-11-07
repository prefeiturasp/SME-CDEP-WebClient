import React, { useCallback, useEffect, useState } from 'react';

import CDEPLogoBranco from '~/assets/cdep-logo-centralizado-branco.svg';

import { cloneDeep } from 'lodash';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '~/core/enum/routes';
import { useAppSelector } from '~/core/hooks/use-redux';
import SiderSME, { MenuItemSMEProps } from '../../lib/sider';
import { MenuItemCDEPProps, menus } from './menus';
import { MenuEnum } from '~/core/enum/menu-enum';

const SiderCDEP: React.FC = () => {
  const navigate = useNavigate();

  const permissaoPorMenu = useAppSelector((state) => state.roles.permissaoPorMenu);

  const [items, setItems] = useState<MenuItemCDEPProps[]>([]);
  const validarExibicaoMenus = useCallback(
    (menusParaValidar: MenuItemCDEPProps[]): MenuItemCDEPProps[] => {
      const newMapMenus = menusParaValidar.map((menu) => {
        if (menu?.children?.length) {
          const children = validarExibicaoMenus(menu.children).filter((subMenu) => {
            if (subMenu.key === MenuEnum.TitulosMaisPesquisados) return true;
            const permissaoMenu = permissaoPorMenu[subMenu?.key];
            return !!permissaoMenu?.exibir;
          });

          menu.children = children;
        }
        return menu;
      });

      return newMapMenus;
    },
    [permissaoPorMenu],
  );

  useEffect(() => {
    if (menus?.length && permissaoPorMenu?.length) {
      const menuCloned = cloneDeep(menus);
      const menusParaExibir = validarExibicaoMenus(menuCloned);
      const menusParaExibirComSubMenus = menusParaExibir.filter((menu) => menu?.children?.length);

      setItems(menusParaExibirComSubMenus);
    }
  }, [validarExibicaoMenus, permissaoPorMenu]);

  useEffect(() => {
    if (menus?.length && permissaoPorMenu?.length) {
      const menuCloned = cloneDeep(menus);
      const menusParaExibir = validarExibicaoMenus(menuCloned);
      const menusParaExibirComSubMenus = menusParaExibir.filter((menu) => menu?.children?.length);

      setItems(menusParaExibirComSubMenus);
    }
  }, [validarExibicaoMenus, permissaoPorMenu]);

  const itemMenuEscolhido = (item: MenuItemSMEProps) => {
    if (item?.url) {
      navigate(item.url);
    }
  };

  return (
    <SiderSME
      onClick={itemMenuEscolhido}
      styleSider={{ zIndex: 12 }}
      items={items}
      logoMenu={
        <Link to={ROUTES.PRINCIPAL}>
          <img style={{ height: '70px' }} src={CDEPLogoBranco} alt='CDEP LOGO' />
        </Link>
      }
    />
  );
};

export default SiderCDEP;
