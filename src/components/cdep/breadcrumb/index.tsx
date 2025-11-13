import { Breadcrumb } from 'antd';
import React from 'react';
import { useBreadcrumb } from '~/core/hooks/use-breadcrumb';

export type BreadcrumbCDEPProps = {
  menu?: string;
  mainPage?: string;
  urlMainPage?: string;
  title?: string;
  auto?: boolean; // Nova prop para controlar se deve usar o breadcrumb automático
};

const BreadcrumbCDEP: React.FC<BreadcrumbCDEPProps> = ({
  menu = 'Menu',
  mainPage = '',
  urlMainPage = '',
  title = 'Nome da Página',
  auto = false,
}) => {
  const autoBreadcrumbItems = useBreadcrumb();

  // Se auto=true, usa o breadcrumb automático baseado na rota
  if (auto) {
    return <Breadcrumb separator='>' items={autoBreadcrumbItems} />;
  }

  // Caso contrário, usa o comportamento antigo (retrocompatibilidade)
  const items = [
    {
      href: '/',
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/ic_round-home.svg"
            alt="Home"
            style={{ width: '16px', height: '16px' }}
          />
          <span>Inicio</span>
        </div>
      ),
    },
    {
      href: '',
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/icon-park-solid_right-c.svg"
            alt=""
            style={{ width: '16px', height: '16px' }}
          />
          <span>{menu}</span>
        </div>
      ),
    },
    {
      href: urlMainPage,
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/icon-park-solid_right-c.svg"
            alt=""
            style={{ width: '16px', height: '16px' }}
          />
          <span>{mainPage}</span>
        </div>
      ),
    },
  ];
  if (title) {
    items.push({
      href: '',
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/icon-park-solid_right-c.svg"
            alt=""
            style={{ width: '16px', height: '16px' }}
          />
          <span>{title}</span>
        </div>
      ),
    });
  }
  return (
    <>
      <Breadcrumb separator='>' items={items} />
    </>
  );
};

export default BreadcrumbCDEP;
