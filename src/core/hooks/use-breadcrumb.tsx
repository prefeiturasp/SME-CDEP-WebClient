import { useLocation } from 'react-router-dom';
import { BREADCRUMB_ROUTES } from '../config/breadcrumb-config';
import { ROUTES } from '../enum/routes';
import React from 'react';
import './use-breadcrumb.css';

export type BreadcrumbItem = {
  href?: string;
  title: React.ReactNode;
};

const BreadcrumbLabel = ({
  icon,
  label,
  color,
  iconSize = 16,
}: {
  icon: string;
  label: string;
  color: string;
  iconSize?: number;
}) => (
  <div className='breadcrumb-label' style={{ height: `${iconSize + 4}px` }}>
    <img
      src={icon}
      alt=''
      className='breadcrumb-icon'
      style={{ width: iconSize, height: iconSize }}
    />
    <span className='breadcrumb-text' style={{ color, lineHeight: `${iconSize}px` }}>
      {label}
    </span>
  </div>
);

export const useBreadcrumb = (): BreadcrumbItem[] => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter((segment) => segment !== '');

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      href: ROUTES.PRINCIPAL,
      title: (
        <BreadcrumbLabel icon='/ic_round-home.svg' label='Início' color='#89162D' iconSize={16} />
      ),
    },
  ];

  if (location.pathname === ROUTES.PRINCIPAL) {
    return breadcrumbItems;
  }

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const pathWithoutParams = currentPath.replace(/\/\d+$/, '');
    const configKey = pathWithoutParams;

    const config = BREADCRUMB_ROUTES[configKey] || BREADCRUMB_ROUTES[currentPath];

    if (config) {
      const isLastItem = index === pathSegments.length - 1;

      breadcrumbItems.push({
        href: !isLastItem && config.path ? config.path : undefined,
        title: (
          <BreadcrumbLabel
            icon='/icon-park-solid_right-c.svg'
            label={config.label}
            color='#929394'
            iconSize={12}
          />
        ),
      });
    }
  });

  return breadcrumbItems;
};
