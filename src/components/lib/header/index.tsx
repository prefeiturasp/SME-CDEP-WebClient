import { LoginOutlined } from '@ant-design/icons';
import { Button, Layout, Row, Space } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import cdepLogo from '~/assets/cdep-logo-centralizado.svg';
import { ROUTES } from '~/core/enum/routes';
import { useAppSelector } from '~/core/hooks/use-redux';
import { store } from '~/core/redux';
import { setDeslogar } from '~/core/redux/modules/auth/actions';
import { BoxShadow, Colors } from '~/core/styles/colors';
import ExitButton from '../exit-button';
import DropdownPerfil from '~/components/cdep/perfis';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';

const contentStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 11,
  width: '100%',
  height: '70px',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: Colors.Neutral.WHITE,
  boxShadow: BoxShadow.DEFAULT,
};

type HeaderProps = {
  logo?: React.ReactNode;
  style?: React.CSSProperties;
};
const Header: React.FC<HeaderProps> = ({ logo, style = {} }) => {
  const autenticado = useAppSelector((state) => state.auth.autenticado);
  const perfil = useAppSelector((state) => state.perfil);

  const perfisAdmin = [
    TipoPerfil.ADMIN_GERAL,
    TipoPerfil.ADMIN_BIBLIOTECA,
    TipoPerfil.ADMIN_MEMORIA,
    TipoPerfil.ADMIN_MEMORIAL,
  ];

  const ehPerfilAdmin =
    perfil && perfisAdmin.includes(perfil.perfilSelecionado?.perfil as TipoPerfil);

  return (
    <Layout.Header style={{ ...contentStyle, ...style }}>
      <Link
        to={autenticado ? (ehPerfilAdmin ? ROUTES.INDICADORES : ROUTES.PRINCIPAL) : ROUTES.LOGIN}
      >
        {logo || <img style={{ height: '75px' }} src={cdepLogo} alt='CDEP LOGO' />}
      </Link>
      <Row justify='end' style={{ width: '100%' }}>
        {autenticado ? (
          <Space>
            <DropdownPerfil />
            <ExitButton
              onClick={() => {
                store.dispatch(setDeslogar());
              }}
            />
          </Space>
        ) : (
          <Link to={ROUTES.LOGIN}>
            <Button
              size='small'
              type='text'
              icon={<LoginOutlined size={18} />}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              Login
            </Button>
          </Link>
        )}
      </Row>
    </Layout.Header>
  );
};

export default Header;
