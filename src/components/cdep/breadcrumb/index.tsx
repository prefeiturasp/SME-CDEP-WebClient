import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import React from 'react';

type BreadcrumbCDEPProps = {
  menu: string;
  paginaPai: string;
  urlPaginaPai: string;
  paginaFilha?: string;
};

const BreadcrumbCDEP: React.FC<BreadcrumbCDEPProps> = ({
  menu,
  paginaPai,
  urlPaginaPai,
  paginaFilha = '',
}) => {
  const temPaginaFilha = paginaFilha?.length > 0 ? true : false;
  const items = [
    {
      href: '/',
      title: (
        <>
          <HomeOutlined />
          <span>Inicio</span>
        </>
      ),
    },
    {
      href: '',
      title: (
        <>
          <span>{menu}</span>
        </>
      ),
    },
    {
      href: urlPaginaPai,
      title: <span>{paginaPai}</span>,
    },
  ];
  if (temPaginaFilha) {
    items.push({
      href: '',
      title: <span>{paginaFilha}</span>,
    });
  }
  return (
    <>
      <Breadcrumb separator='>' items={items} />
    </>
  );
};

export default BreadcrumbCDEP;
