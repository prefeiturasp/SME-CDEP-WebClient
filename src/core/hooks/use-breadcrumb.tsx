import { useLocation } from 'react-router-dom';
import { BREADCRUMB_ROUTES } from '../config/breadcrumb-config';
import { ROUTES } from '../enum/routes';

export type BreadcrumbItem = {
  href?: string;
  title: React.ReactNode;
};

export const useBreadcrumb = (): BreadcrumbItem[] => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter((segment) => segment !== '');

  // Sempre começa com o item "Início"
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      href: ROUTES.PRINCIPAL,
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/ic_round-home.svg"
            alt="Home"
            style={{ width: '16px', height: '16px' }}
          />
          <span>Início</span>
        </div>
      ),
    },
  ];

  // Se estiver na página inicial, retorna apenas "Início"
  if (location.pathname === ROUTES.PRINCIPAL) {
    return breadcrumbItems;
  }

  // Constrói o breadcrumb baseado nos segmentos da URL
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Remove parâmetros dinâmicos (ex: /editar/123 -> /editar)
    const pathWithoutParams = currentPath.replace(/\/\d+$/, '');
    const configKey = pathWithoutParams;

    // Busca a configuração para este segmento
    const config = BREADCRUMB_ROUTES[configKey] || BREADCRUMB_ROUTES[currentPath];

    if (config) {
      // Último item não deve ser clicável
      const isLastItem = index === pathSegments.length - 1;

      breadcrumbItems.push({
        href: !isLastItem && config.path ? config.path : undefined,
        title: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="/icon-park-solid_right-c.svg"
              alt=""
              style={{ width: '16px', height: '16px' }}
            />
            <span>{config.label}</span>
          </div>
        ),
      });
    }
  });

  return breadcrumbItems;
};
