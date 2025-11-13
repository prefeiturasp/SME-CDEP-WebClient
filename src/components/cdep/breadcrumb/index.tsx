import { Breadcrumb } from 'antd';
import React from 'react';
import { useBreadcrumb } from '~/core/hooks/use-breadcrumb';

export type BreadcrumbCDEPProps = {
  menu?: string;
  mainPage?: string;
  urlMainPage?: string;
  title?: string;
  auto?: boolean;
};

const BreadcrumbCDEP: React.FC<BreadcrumbCDEPProps> = ({
  menu = 'Menu',
  mainPage = '',
  urlMainPage = '',
  title = 'Nome da Página',
  auto = false,
}) => {
  const autoBreadcrumbItems = useBreadcrumb();

  if (auto) {
    return <Breadcrumb separator='>' items={autoBreadcrumbItems} />;
  }

  const items = [
    {
      href: '/',
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src='/ic_round-home.svg' alt='Home' style={{ width: '140px', height: '14px' }} />
          <span>Inicio</span>
        </div>
      ),
    },
    {
      href: '',
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src='/icon-park-solid_right-c.svg'
            alt=''
            style={{ width: '12px', height: '12px' }}
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
            src='/icon-park-solid_right-c.svg'
            alt=''
            style={{ width: '12px', height: '12px' }}
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
            src='/icon-park-solid_right-c.svg'
            alt=''
            style={{ width: '12px', height: '12px' }}
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
